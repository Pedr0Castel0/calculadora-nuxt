<template>
  <div class="conversion-result bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
    <div class="text-center">
      <label class="block text-xs sm:text-sm font-medium text-slate-600 mb-2 sm:mb-3"
        >Resultado</label
      >

      <div
        class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-3 sm:mb-4"
      >
        <div class="text-xl sm:text-3xl font-light text-slate-800 mb-1 sm:mb-2 break-all">
          {{ formattedResult }}
        </div>
        <div class="text-xs sm:text-sm text-slate-600">
          {{ resultUnit ? units[resultUnit]?.name : "" }}
        </div>
      </div>

      <!-- Fórmula de conversão -->
      <div v-if="conversionFormula" class="bg-slate-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
        <div class="text-xs text-slate-500 mb-1">Fórmula</div>
        <div class="text-xs sm:text-sm text-slate-700 font-mono break-all">
          {{ conversionFormula }}
        </div>
      </div>

      <!-- Botão de copiar resultado -->
      <button
        class="flex items-center gap-2 mx-auto px-3 sm:px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-xs sm:text-sm font-medium"
        @click="copyResult"
      >
        <span class="text-sm">📋</span>
        <span>{{ copied ? "Copiado!" : "Copiar resultado" }}</span>
      </button>
    </div>

    <!-- Histórico de conversões -->
    <div
      v-if="showHistory && history?.length && history.length > 0"
      class="mt-4 sm:mt-6"
    >
      <div class="flex items-center justify-between mb-2 sm:mb-3">
        <h4 class="text-xs sm:text-sm font-medium text-slate-600">Histórico</h4>
        <button
          class="text-xs text-red-500 hover:text-red-700 transition-colors"
          @click="$emit('clearHistory')"
        >
          Limpar
        </button>
      </div>

      <div class="space-y-1 sm:space-y-2 max-h-24 sm:max-h-32 overflow-y-auto">
        <div
          v-for="(item, index) in history?.slice(0, 5) || []"
          :key="index"
          class="bg-slate-50 rounded-lg p-2 sm:p-3 text-xs text-slate-600 break-all"
        >
          {{ item }}
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
  result: number | null;
  resultUnit: string | null;
  units: { [key: string]: Unit };
  conversionFormula?: string;
  showHistory?: boolean;
  history?: string[];
}

const props = defineProps<Props>();
defineEmits<{
  clearHistory: [];
}>();

const copied = ref(false);

const formattedResult = computed(() => {
  if (props.result === null || isNaN(props.result)) return "0";

  const num = props.result;

  // Formatação baseada na magnitude do número
  if (Math.abs(num) >= 1e6) {
    return num.toExponential(6);
  } else if (Math.abs(num) >= 1000) {
    return num.toLocaleString("pt-BR", { maximumFractionDigits: 3 });
  } else if (Math.abs(num) >= 1) {
    return num.toLocaleString("pt-BR", { maximumFractionDigits: 6 });
  } else if (Math.abs(num) >= 0.001) {
    return num.toFixed(6).replace(/\.?0+$/, "");
  } else if (num === 0) {
    return "0";
  } else {
    return num.toExponential(6);
  }
});

const copyResult = async () => {
  if (props.result !== null && !isNaN(props.result)) {
    try {
      await navigator.clipboard.writeText(props.result.toString());
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 2000);
    } catch (error) {
      console.error("Erro ao copiar:", error);
    }
  }
};
</script>
