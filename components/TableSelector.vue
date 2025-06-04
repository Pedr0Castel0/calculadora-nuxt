<template>
  <div class="table-selector">
    <!-- Desktop: Menu lateral -->
    <div
      class="hidden lg:block w-full bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 h-fit"
    >
      <h3
        class="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4"
      >
        Tabelas Técnicas
      </h3>
      <div class="space-y-1 sm:space-y-2">
        <button
          v-for="table in tables"
          :key="table.id"
          :class="{
            'bg-blue-500 text-white': selectedTable?.id === table.id,
            'bg-slate-50 text-slate-700 hover:bg-slate-100':
              selectedTable?.id !== table.id,
          }"
          class="w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-150 text-left text-sm sm:text-base"
          @click="$emit('tableSelected', table)"
        >
          <span class="text-base sm:text-xl">{{ table.icon }}</span>
          <div class="flex-1 min-w-0">
            <div class="font-medium truncate">{{ table.name }}</div>
            <div class="text-xs text-current opacity-75 truncate">
              {{ table.shortDescription }}
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Mobile: Dropdown -->
    <div class="lg:hidden">
      <button
        class="w-full bg-white rounded-xl shadow-lg p-3 sm:p-4 flex items-center justify-between"
        @click="showMobileMenu = !showMobileMenu"
      >
        <div class="flex items-center gap-2 sm:gap-3">
          <span class="text-lg sm:text-xl">{{
            selectedTable?.icon || "📊"
          }}</span>
          <span class="font-medium text-slate-800 text-sm sm:text-base">
            {{ selectedTable?.name || "Selecionar Tabela" }}
          </span>
        </div>
        <span
          class="text-slate-400 transform transition-transform text-sm"
          :class="{ 'rotate-180': showMobileMenu }"
        >
          ▼
        </span>
      </button>

      <div
        v-if="showMobileMenu"
        class="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-2xl border border-slate-200 max-h-64 sm:max-h-80 overflow-y-auto"
      >
        <div class="p-2">
          <button
            v-for="table in tables"
            :key="table.id"
            :class="{
              'bg-blue-500 text-white': selectedTable?.id === table.id,
              'text-slate-700 hover:bg-slate-50':
                selectedTable?.id !== table.id,
            }"
            class="w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-150 text-left text-sm sm:text-base"
            @click="selectMobileTable(table)"
          >
            <span class="text-base sm:text-xl">{{ table.icon }}</span>
            <div class="flex-1 min-w-0">
              <div class="font-medium truncate">{{ table.name }}</div>
              <div class="text-xs text-current opacity-75 truncate">
                {{ table.shortDescription }}
              </div>
            </div>
          </button>
        </div>
      </div>
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
  data: any[];
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
  selectedTable?: TechnicalTable | null;
}

defineProps<Props>();
const emit = defineEmits<{
  tableSelected: [table: TechnicalTable];
}>();

const showMobileMenu = ref(false);

const tables: TechnicalTable[] = [
  {
    id: "fractional-metric",
    name: "Frações ↔ Métrico",
    description:
      "Conversão entre medidas fracionárias em polegadas e equivalentes métricos",
    shortDescription: "Polegadas fracionárias",
    icon: "📏",
    hasUnitSwitcher: false,
    columns: [
      { key: "fraction", label: "Fração (in)", type: "text" },
      { key: "decimal", label: "Decimal (in)", type: "number", copyable: true },
      { key: "millimeters", label: "mm", type: "number", copyable: true },
    ],
    data: [
      { fraction: "1/64", decimal: 0.015625, millimeters: 0.397 },
      { fraction: "1/32", decimal: 0.03125, millimeters: 0.794 },
      { fraction: "3/64", decimal: 0.046875, millimeters: 1.191 },
      { fraction: "1/16", decimal: 0.0625, millimeters: 1.588 },
      { fraction: "5/64", decimal: 0.078125, millimeters: 1.984 },
      { fraction: "3/32", decimal: 0.09375, millimeters: 2.381 },
      { fraction: "7/64", decimal: 0.109375, millimeters: 2.778 },
      { fraction: "1/8", decimal: 0.125, millimeters: 3.175 },
      { fraction: "9/64", decimal: 0.140625, millimeters: 3.572 },
      { fraction: "5/32", decimal: 0.15625, millimeters: 3.969 },
      { fraction: "11/64", decimal: 0.171875, millimeters: 4.366 },
      { fraction: "3/16", decimal: 0.1875, millimeters: 4.763 },
      { fraction: "13/64", decimal: 0.203125, millimeters: 5.159 },
      { fraction: "7/32", decimal: 0.21875, millimeters: 5.556 },
      { fraction: "15/64", decimal: 0.234375, millimeters: 5.953 },
      { fraction: "1/4", decimal: 0.25, millimeters: 6.35 },
      { fraction: "17/64", decimal: 0.265625, millimeters: 6.747 },
      { fraction: "9/32", decimal: 0.28125, millimeters: 7.144 },
      { fraction: "19/64", decimal: 0.296875, millimeters: 7.541 },
      { fraction: "5/16", decimal: 0.3125, millimeters: 7.938 },
      { fraction: "21/64", decimal: 0.328125, millimeters: 8.334 },
      { fraction: "11/32", decimal: 0.34375, millimeters: 8.731 },
      { fraction: "23/64", decimal: 0.359375, millimeters: 9.128 },
      { fraction: "3/8", decimal: 0.375, millimeters: 9.525 },
      { fraction: "25/64", decimal: 0.390625, millimeters: 9.922 },
      { fraction: "13/32", decimal: 0.40625, millimeters: 10.319 },
      { fraction: "27/64", decimal: 0.421875, millimeters: 10.716 },
      { fraction: "7/16", decimal: 0.4375, millimeters: 11.113 },
      { fraction: "29/64", decimal: 0.453125, millimeters: 11.509 },
      { fraction: "15/32", decimal: 0.46875, millimeters: 11.906 },
      { fraction: "31/64", decimal: 0.484375, millimeters: 12.303 },
      { fraction: "1/2", decimal: 0.5, millimeters: 12.7 },
    ],
  },
  {
    id: "steam-saturation",
    name: "Saturação de Vapor",
    description:
      "Propriedades termodinâmicas do vapor d'água saturado em função da temperatura",
    shortDescription: "Vapor d'água saturado",
    icon: "🌡️",
    hasUnitSwitcher: true,
    columns: [
      {
        key: "temperature",
        label: "Temperatura",
        type: "number",
        unit: "°C",
        copyable: true,
      },
      {
        key: "pressure",
        label: "Pressão",
        type: "number",
        unit: "bar",
        copyable: true,
      },
      {
        key: "enthalpy_liquid",
        label: "Entalpia Líquido",
        type: "number",
        unit: "kJ/kg",
        copyable: true,
      },
      {
        key: "enthalpy_vapor",
        label: "Entalpia Vapor",
        type: "number",
        unit: "kJ/kg",
        copyable: true,
      },
    ],
    data: [
      {
        temperature: 0,
        pressure: 0.00611,
        enthalpy_liquid: 0.0,
        enthalpy_vapor: 2501.3,
      },
      {
        temperature: 10,
        pressure: 0.01228,
        enthalpy_liquid: 42.0,
        enthalpy_vapor: 2519.8,
      },
      {
        temperature: 20,
        pressure: 0.02339,
        enthalpy_liquid: 83.9,
        enthalpy_vapor: 2538.1,
      },
      {
        temperature: 30,
        pressure: 0.04246,
        enthalpy_liquid: 125.8,
        enthalpy_vapor: 2556.3,
      },
      {
        temperature: 40,
        pressure: 0.07384,
        enthalpy_liquid: 167.6,
        enthalpy_vapor: 2574.3,
      },
      {
        temperature: 50,
        pressure: 0.12344,
        enthalpy_liquid: 209.3,
        enthalpy_vapor: 2592.1,
      },
      {
        temperature: 60,
        pressure: 0.1994,
        enthalpy_liquid: 251.1,
        enthalpy_vapor: 2609.6,
      },
      {
        temperature: 70,
        pressure: 0.31176,
        enthalpy_liquid: 293.0,
        enthalpy_vapor: 2626.8,
      },
      {
        temperature: 80,
        pressure: 0.47373,
        enthalpy_liquid: 334.9,
        enthalpy_vapor: 2643.7,
      },
      {
        temperature: 90,
        pressure: 0.70108,
        enthalpy_liquid: 376.9,
        enthalpy_vapor: 2660.1,
      },
      {
        temperature: 100,
        pressure: 1.01325,
        enthalpy_liquid: 419.0,
        enthalpy_vapor: 2676.1,
      },
      {
        temperature: 110,
        pressure: 1.4327,
        enthalpy_liquid: 461.3,
        enthalpy_vapor: 2691.5,
      },
      {
        temperature: 120,
        pressure: 1.9855,
        enthalpy_liquid: 503.7,
        enthalpy_vapor: 2706.6,
      },
      {
        temperature: 130,
        pressure: 2.701,
        enthalpy_liquid: 546.3,
        enthalpy_vapor: 2720.9,
      },
      {
        temperature: 140,
        pressure: 3.6135,
        enthalpy_liquid: 589.1,
        enthalpy_vapor: 2734.8,
      },
      {
        temperature: 150,
        pressure: 4.7586,
        enthalpy_liquid: 632.2,
        enthalpy_vapor: 2748.0,
      },
    ],
  },
  {
    id: "material-properties",
    name: "Propriedades de Materiais",
    description:
      "Propriedades físicas e térmicas de materiais de engenharia comuns",
    shortDescription: "Propriedades físicas",
    icon: "🔩",
    hasUnitSwitcher: false,
    columns: [
      { key: "material", label: "Material", type: "text" },
      {
        key: "density",
        label: "Densidade (kg/m³)",
        type: "number",
        copyable: true,
      },
      {
        key: "thermal_conductivity",
        label: "Condutividade Térmica (W/m·K)",
        type: "number",
        copyable: true,
      },
      {
        key: "specific_heat",
        label: "Calor Específico (J/kg·K)",
        type: "number",
        copyable: true,
      },
    ],
    data: [
      {
        material: "Aço Carbono",
        density: 7850,
        thermal_conductivity: 50,
        specific_heat: 490,
      },
      {
        material: "Aço Inoxidável 304",
        density: 8000,
        thermal_conductivity: 16,
        specific_heat: 500,
      },
      {
        material: "Alumínio 6061",
        density: 2700,
        thermal_conductivity: 167,
        specific_heat: 896,
      },
      {
        material: "Cobre",
        density: 8960,
        thermal_conductivity: 401,
        specific_heat: 385,
      },
      {
        material: "Latão",
        density: 8500,
        thermal_conductivity: 109,
        specific_heat: 380,
      },
      {
        material: "Ferro Fundido",
        density: 7200,
        thermal_conductivity: 55,
        specific_heat: 460,
      },
      {
        material: "Titânio",
        density: 4500,
        thermal_conductivity: 22,
        specific_heat: 523,
      },
      {
        material: "PVC",
        density: 1400,
        thermal_conductivity: 0.19,
        specific_heat: 900,
      },
      {
        material: "Nylon",
        density: 1150,
        thermal_conductivity: 0.25,
        specific_heat: 1700,
      },
      {
        material: "Concreto",
        density: 2400,
        thermal_conductivity: 1.7,
        specific_heat: 880,
      },
    ],
  },
  {
    id: "bolt-torque",
    name: "Torque de Parafusos",
    description:
      "Valores de torque recomendados para parafusos métricos em diferentes classes",
    shortDescription: "Torques de aperto",
    icon: "🔧",
    hasUnitSwitcher: true,
    columns: [
      { key: "size", label: "Tamanho", type: "text" },
      {
        key: "class_8_8",
        label: "Classe 8.8",
        type: "number",
        unit: "Nm",
        copyable: true,
      },
      {
        key: "class_10_9",
        label: "Classe 10.9",
        type: "number",
        unit: "Nm",
        copyable: true,
      },
      {
        key: "class_12_9",
        label: "Classe 12.9",
        type: "number",
        unit: "Nm",
        copyable: true,
      },
    ],
    data: [
      { size: "M3", class_8_8: 1.8, class_10_9: 2.6, class_12_9: 3.1 },
      { size: "M4", class_8_8: 4.2, class_10_9: 6.0, class_12_9: 7.2 },
      { size: "M5", class_8_8: 8.2, class_10_9: 12, class_12_9: 14 },
      { size: "M6", class_8_8: 14, class_10_9: 20, class_12_9: 25 },
      { size: "M8", class_8_8: 33, class_10_9: 47, class_12_9: 58 },
      { size: "M10", class_8_8: 65, class_10_9: 92, class_12_9: 115 },
      { size: "M12", class_8_8: 113, class_10_9: 160, class_12_9: 200 },
      { size: "M14", class_8_8: 175, class_10_9: 250, class_12_9: 310 },
      { size: "M16", class_8_8: 260, class_10_9: 370, class_12_9: 460 },
      { size: "M18", class_8_8: 360, class_10_9: 510, class_12_9: 640 },
      { size: "M20", class_8_8: 510, class_10_9: 720, class_12_9: 900 },
      { size: "M22", class_8_8: 690, class_10_9: 980, class_12_9: 1220 },
      { size: "M24", class_8_8: 900, class_10_9: 1280, class_12_9: 1600 },
      { size: "M27", class_8_8: 1350, class_10_9: 1900, class_12_9: 2400 },
      { size: "M30", class_8_8: 1850, class_10_9: 2600, class_12_9: 3300 },
    ],
  },
  {
    id: "thread-fittings",
    name: "Roscas e Conexões",
    description:
      "Especificações de roscas métricas, BSP, NPT e outras conexões padronizadas",
    shortDescription: "Especificações de roscas",
    icon: "🧵",
    hasUnitSwitcher: false,
    columns: [
      { key: "designation", label: "Designação", type: "text" },
      {
        key: "thread_pitch",
        label: "Passo (mm)",
        type: "number",
        copyable: true,
      },
      {
        key: "major_diameter",
        label: "Ø Externo (mm)",
        type: "number",
        copyable: true,
      },
      {
        key: "minor_diameter",
        label: "Ø Menor (mm)",
        type: "number",
        copyable: true,
      },
    ],
    data: [
      {
        designation: "M3×0.5",
        thread_pitch: 0.5,
        major_diameter: 3.0,
        minor_diameter: 2.459,
      },
      {
        designation: "M4×0.7",
        thread_pitch: 0.7,
        major_diameter: 4.0,
        minor_diameter: 3.242,
      },
      {
        designation: "M5×0.8",
        thread_pitch: 0.8,
        major_diameter: 5.0,
        minor_diameter: 4.134,
      },
      {
        designation: "M6×1.0",
        thread_pitch: 1.0,
        major_diameter: 6.0,
        minor_diameter: 4.918,
      },
      {
        designation: "M8×1.25",
        thread_pitch: 1.25,
        major_diameter: 8.0,
        minor_diameter: 6.647,
      },
      {
        designation: "M10×1.5",
        thread_pitch: 1.5,
        major_diameter: 10.0,
        minor_diameter: 8.376,
      },
      {
        designation: "M12×1.75",
        thread_pitch: 1.75,
        major_diameter: 12.0,
        minor_diameter: 10.106,
      },
      {
        designation: "M14×2.0",
        thread_pitch: 2.0,
        major_diameter: 14.0,
        minor_diameter: 11.835,
      },
      {
        designation: "M16×2.0",
        thread_pitch: 2.0,
        major_diameter: 16.0,
        minor_diameter: 13.835,
      },
      {
        designation: "M18×2.5",
        thread_pitch: 2.5,
        major_diameter: 18.0,
        minor_diameter: 15.294,
      },
      {
        designation: "M20×2.5",
        thread_pitch: 2.5,
        major_diameter: 20.0,
        minor_diameter: 17.294,
      },
      {
        designation: "M22×2.5",
        thread_pitch: 2.5,
        major_diameter: 22.0,
        minor_diameter: 19.294,
      },
      {
        designation: "M24×3.0",
        thread_pitch: 3.0,
        major_diameter: 24.0,
        minor_diameter: 20.752,
      },
      {
        designation: "M27×3.0",
        thread_pitch: 3.0,
        major_diameter: 27.0,
        minor_diameter: 23.752,
      },
      {
        designation: "M30×3.5",
        thread_pitch: 3.5,
        major_diameter: 30.0,
        minor_diameter: 26.211,
      },
    ],
  },
];

const selectMobileTable = (table: TechnicalTable) => {
  showMobileMenu.value = false;
  emit("tableSelected", table);
};

// Fechar dropdown ao clicar fora
onMounted(() => {
  const handleClickOutside = (e: Event) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".table-selector")) {
      showMobileMenu.value = false;
    }
  };

  document.addEventListener("click", handleClickOutside);

  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
  });
});
</script>
