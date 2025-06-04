<template>
  <div class="tech-tables bg-white rounded-xl shadow-lg p-4 sm:p-6">
    <!-- Toast de cópia -->
    <transition name="toast">
      <div
        v-if="showCopyToast"
        class="fixed top-4 right-4 z-50 px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg"
      >
        ✓ Copiado!
      </div>
    </transition>

    <!-- Tabela não selecionada -->
    <div v-if="!props.selectedTable" class="text-center py-8">
      <div class="text-4xl mb-4">📊</div>
      <h2 class="text-xl text-slate-600 mb-2">Tabelas Técnicas</h2>
      <p class="text-sm text-slate-500">
        Selecione uma categoria para visualizar dados técnicos
      </p>
    </div>

    <!-- Tabela selecionada -->
    <div v-else class="space-y-4">
      <!-- Header da tabela -->
      <div
        class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div class="flex items-center gap-3">
          <span class="text-2xl">{{ props.selectedTable.icon }}</span>
          <div>
            <h2 class="text-xl font-semibold text-slate-800">
              {{ props.selectedTable.name }}
            </h2>
            <p class="text-sm text-slate-600">
              {{ props.selectedTable.description }}
            </p>
          </div>
        </div>

        <!-- Unit switcher -->
        <UnitSwitcher
          v-if="props.selectedTable.hasUnitSwitcher"
          :table-id="props.selectedTable.id"
          @unit-changed="onUnitChanged"
        />
      </div>

      <!-- Tabela dinâmica -->
      <DynamicTable :table="convertedTableData" @copy-value="onCopyValue" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface TechnicalTable {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  icon: string;
  hasUnitSwitcher: boolean;
  data: Record<string, any>[];
  columns: TableColumn[];
}

interface TableColumn {
  key: string;
  label: string;
  type: "number" | "text";
  unit?: string;
  copyable?: boolean;
}

interface Props {
  selectedTable: TechnicalTable | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  tableSelected: [table: TechnicalTable];
}>();

const currentUnits = ref<{ [key: string]: string }>({});
const showCopyToast = ref(false);

// Funções de conversão
const unitConversions = {
  temperature: {
    celsius_to_fahrenheit: (c: number) => (c * 9) / 5 + 32,
    celsius_to_kelvin: (c: number) => c + 273.15,
    fahrenheit_to_celsius: (f: number) => ((f - 32) * 5) / 9,
    kelvin_to_celsius: (k: number) => k - 273.15,
  },
  pressure: {
    bar_to_psi: (bar: number) => bar * 14.5038,
    bar_to_pa: (bar: number) => bar * 100000,
    bar_to_atm: (bar: number) => bar * 0.986923,
    psi_to_bar: (psi: number) => psi / 14.5038,
    pa_to_bar: (pa: number) => pa / 100000,
    atm_to_bar: (atm: number) => atm * 1.01325,
  },
  torque: {
    nm_to_lbf_ft: (nm: number) => nm * 0.737562,
    nm_to_in_lbs: (nm: number) => nm * 8.85075,
    lbf_ft_to_nm: (lbf_ft: number) => lbf_ft / 0.737562,
    in_lbs_to_nm: (in_lbs: number) => in_lbs / 8.85075,
  },
};

// Dados convertidos da tabela
const convertedTableData = computed(() => {
  if (!props.selectedTable) return null;

  const table = { ...props.selectedTable };

  if (!table.hasUnitSwitcher) return table;

  // Criar cópia dos dados para conversão
  const convertedData = table.data.map((row) => {
    const newRow = { ...row };

    table.columns.forEach((column) => {
      if (
        column.type === "number" &&
        column.unit &&
        currentUnits.value[column.key]
      ) {
        const originalUnit = column.unit;
        const targetUnit = currentUnits.value[column.key];

        if (originalUnit !== targetUnit) {
          const value = row[column.key];
          newRow[column.key] = convertValue(
            value,
            originalUnit,
            targetUnit,
            column.key
          );
        }
      }
    });

    return newRow;
  });

  return { ...table, data: convertedData };
});

const convertValue = (
  value: number,
  fromUnit: string,
  toUnit: string,
  columnKey: string
): number => {
  if (fromUnit === toUnit) return value;

  // Conversões de temperatura
  if (columnKey === "temperature") {
    let celsius = value;

    // Converter para Celsius primeiro
    if (fromUnit === "°F") {
      celsius = unitConversions.temperature.fahrenheit_to_celsius(value);
    } else if (fromUnit === "K") {
      celsius = unitConversions.temperature.kelvin_to_celsius(value);
    }

    // Converter de Celsius para unidade alvo
    if (toUnit === "°F") {
      return unitConversions.temperature.celsius_to_fahrenheit(celsius);
    } else if (toUnit === "K") {
      return unitConversions.temperature.celsius_to_kelvin(celsius);
    }

    return celsius;
  }

  // Conversões de pressão
  if (columnKey === "pressure") {
    let bar = value;

    // Converter para bar primeiro
    if (fromUnit === "psi") {
      bar = unitConversions.pressure.psi_to_bar(value);
    } else if (fromUnit === "Pa") {
      bar = unitConversions.pressure.pa_to_bar(value);
    } else if (fromUnit === "atm") {
      bar = unitConversions.pressure.atm_to_bar(value);
    }

    // Converter de bar para unidade alvo
    if (toUnit === "psi") {
      return unitConversions.pressure.bar_to_psi(bar);
    } else if (toUnit === "Pa") {
      return unitConversions.pressure.bar_to_pa(bar);
    } else if (toUnit === "atm") {
      return unitConversions.pressure.bar_to_atm(bar);
    }

    return bar;
  }

  // Conversões de torque (para todas as colunas de torque)
  if (columnKey.includes("class_") || columnKey === "torque") {
    let nm = value;

    // Converter para Nm primeiro
    if (fromUnit === "lbf-ft") {
      nm = unitConversions.torque.lbf_ft_to_nm(value);
    } else if (fromUnit === "in-lbs") {
      nm = unitConversions.torque.in_lbs_to_nm(value);
    }

    // Converter de Nm para unidade alvo
    if (toUnit === "lbf-ft") {
      return unitConversions.torque.nm_to_lbf_ft(nm);
    } else if (toUnit === "in-lbs") {
      return unitConversions.torque.nm_to_in_lbs(nm);
    }

    return nm;
  }

  return value;
};

// Observar mudanças na tabela selecionada para inicializar unidades
watch(
  () => props.selectedTable,
  (table) => {
    if (table?.hasUnitSwitcher) {
      currentUnits.value = {};
      table.columns.forEach((col) => {
        if (col.unit) {
          currentUnits.value[col.key] = col.unit;
        }
      });
    }
  }
);

const onUnitChanged = (columnKey: string, unit: string) => {
  if (props.selectedTable?.id === "bolt-torque" && columnKey === "torque") {
    // Para tabela de torque, aplicar a mesma unidade para todas as colunas de classe
    props.selectedTable.columns.forEach((col) => {
      if (col.key.includes("class_")) {
        currentUnits.value[col.key] = unit;
      }
    });
  } else {
    currentUnits.value[columnKey] = unit;
  }
};

const onCopyValue = () => {
  showCopyToast.value = true;
  setTimeout(() => {
    showCopyToast.value = false;
  }, 2000);
};
</script>
