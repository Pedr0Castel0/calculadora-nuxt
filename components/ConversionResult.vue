<template>
  <div class="conversion-result bg-white rounded-2xl shadow-lg p-6">
    <div class="text-center">
      <label class="block text-sm font-medium text-slate-600 mb-3"
        >Resultado</label
      >

      <div
        class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 mb-4"
      >
        <div class="text-3xl font-light text-slate-800 mb-2 break-all">
          {{ formattedResult }}
        </div>
        <div class="text-sm text-slate-600">
          {{ resultUnit ? units[resultUnit]?.name : "" }}
        </div>
      </div>

      <!-- Fórmula de conversão -->
      <div v-if="conversionFormula" class="bg-slate-50 rounded-lg p-4 mb-4">
        <div class="text-xs text-slate-500 mb-1">Fórmula</div>
        <div class="text-sm text-slate-700 font-mono">
          {{ conversionFormula }}
        </div>
      </div>

      <!-- Botão de copiar resultado -->
      <button
        class="flex items-center gap-2 mx-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium"
        @click="copyResult"
      >
        <span>📋</span>
        <span>{{ copied ? "Copiado!" : "Copiar resultado" }}</span>
      </button>
    </div>

    <!-- Histórico de conversões -->
    <div
      v-if="showHistory && history?.length && history.length > 0"
      class="mt-6"
    >
      <div class="flex items-center justify-between mb-3">
        <h4 class="text-sm font-medium text-slate-600">Histórico</h4>
        <button
          class="text-xs text-red-500 hover:text-red-700 transition-colors"
          @click="$emit('clearHistory')"
        >
          Limpar
        </button>
      </div>

      <div class="space-y-2 max-h-32 overflow-y-auto">
        <div
          v-for="(item, index) in history?.slice(0, 5) || []"
          :key="index"
          class="bg-slate-50 rounded-lg p-3 text-xs text-slate-600"
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
