<template>
  <div class="unit-input bg-white rounded-2xl shadow-lg p-6">
    <label class="block text-sm font-medium text-slate-600 mb-3">{{
      label
    }}</label>

    <div class="space-y-4">
      <!-- Campo de valor -->
      <div class="relative">
        <input
          :value="value"
          type="number"
          step="any"
          placeholder="0"
          class="w-full px-4 py-4 text-xl font-light bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
          @input="
            $emit('valueChange', ($event.target as HTMLInputElement).value)
          "
        />
      </div>

      <!-- Dropdown de unidades -->
      <div class="relative">
        <button
          class="w-full flex items-center justify-between p-4 bg-slate-50 border-2 border-slate-200 rounded-xl hover:border-slate-300 focus:outline-none focus:border-blue-500 transition-colors"
          @click="showDropdown = !showDropdown"
        >
          <span class="font-medium text-slate-800">
            {{ selectedUnit ? units[selectedUnit].name : "Selecionar unidade" }}
          </span>
          <span
            class="text-slate-400 transform transition-transform"
            :class="{ 'rotate-180': showDropdown }"
          >
            <Icon name="heroicons:chevron-down" />
          </span>
        </button>

        <div
          v-if="showDropdown"
          class="absolute z-40 mt-2 w-full bg-white rounded-xl shadow-2xl border border-slate-200 max-h-60 overflow-y-auto"
        >
          <div class="p-2">
            <button
              v-for="(unit, key) in units"
              :key="key"
              :class="{
                'bg-blue-500 text-white': selectedUnit === key,
                'text-slate-700 hover:bg-slate-50': selectedUnit !== key,
              }"
              class="w-full text-left px-4 py-3 rounded-lg transition-all duration-150 font-medium"
              @click="selectUnit(key as string)"
            >
              {{ unit.name }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Unit {
  name: string;
  factor: number;
  offset?: number;
}

interface Props {
  label: string;
  value: string;
  selectedUnit: string | null;
  units: { [key: string]: Unit };
}

defineProps<Props>();
const emit = defineEmits<{
  valueChange: [value: string];
  unitChange: [unit: string];
}>();

const showDropdown = ref(false);

const selectUnit = (unitKey: string) => {
  showDropdown.value = false;
  emit("unitChange", unitKey);
};

// Fechar dropdown ao clicar fora
onMounted(() => {
  const handleClickOutside = (e: Event) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".unit-input")) {
      showDropdown.value = false;
    }
  };

  document.addEventListener("click", handleClickOutside);

  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
  });
});
</script>
