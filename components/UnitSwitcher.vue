<template>
  <div class="unit-switcher flex items-center gap-2">
    <span class="text-xs text-slate-600 hidden sm:inline">Unidades:</span>

    <!-- Switchers específicos por tabela -->
    <div v-if="tableId === 'steam-saturation'" class="flex flex-wrap gap-2">
      <!-- Temperatura -->
      <select
        class="text-xs px-2 py-1 border border-slate-300 rounded-md bg-white focus:outline-none focus:border-blue-500"
        @change="onUnitChange('temperature', ($event.target as HTMLSelectElement).value)"
      >
        <option value="°C">°C</option>
        <option value="°F">°F</option>
        <option value="K">K</option>
      </select>

      <!-- Pressão -->
      <select
        class="text-xs px-2 py-1 border border-slate-300 rounded-md bg-white focus:outline-none focus:border-blue-500"
        @change="onUnitChange('pressure', ($event.target as HTMLSelectElement).value)"
      >
        <option value="bar">bar</option>
        <option value="psi">psi</option>
        <option value="Pa">Pa</option>
        <option value="atm">atm</option>
      </select>
    </div>

    <div v-else-if="tableId === 'bolt-torque'" class="flex gap-2">
      <!-- Torque -->
      <select
        class="text-xs px-2 py-1 border border-slate-300 rounded-md bg-white focus:outline-none focus:border-blue-500"
        @change="onUnitChange('torque', ($event.target as HTMLSelectElement).value)"
      >
        <option value="Nm">N⋅m</option>
        <option value="lbf-ft">lbf⋅ft</option>
        <option value="in-lbs">in⋅lbs</option>
      </select>
    </div>

    <!-- Toggle simples para outras tabelas -->
    <div v-else class="flex items-center">
      <button
        class="flex items-center gap-1 px-2 py-1 text-xs border border-slate-300 rounded-md bg-white hover:bg-slate-50 focus:outline-none focus:border-blue-500 transition-colors"
        @click="toggleMetricImperial"
      >
        <span>{{ isMetric ? "🌍" : "🇺🇸" }}</span>
        <span>{{ isMetric ? "Métrico" : "Imperial" }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  tableId: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  unitChanged: [columnKey: string, unit: string];
}>();

const isMetric = ref(true);

const _unitConversions = {
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

const onUnitChange = (columnKey: string, unit: string) => {
  emit("unitChanged", columnKey, unit);
};

const toggleMetricImperial = () => {
  isMetric.value = !isMetric.value;

  // Emitir mudanças baseadas na tabela
  if (props.tableId === "fractional-metric") {
    // Esta tabela já tem ambas as unidades, não precisa conversão
    return;
  }

  // Para outras tabelas futuras que podem ter toggle métrico/imperial
  emit("unitChanged", "system", isMetric.value ? "metric" : "imperial");
};
</script>
