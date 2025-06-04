<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex items-center justify-center p-4 font-sans"
  >
    <div class="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-slate-800 tracking-tight">
          Calculadora PWA
        </h1>
        <div class="flex items-center gap-2">
          <NuxtLink
            to="/converter"
            class="flex items-center gap-2 px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl transition-colors text-sm font-medium"
            title="Conversor de Unidades"
          >
            <span>🔄</span>
            <span class="hidden sm:inline">Conversor</span>
          </NuxtLink>
          <button
            class="hover:bg-blue-500 hover:text-white px-4 py-2 rounded-xl text-sm font-medium text-slate-600 transition-all duration-200"
            :class="{
              'bg-blue-500 text-white': isScientificMode,
              'bg-slate-100 text-slate-600': !isScientificMode,
            }"
            @click="toggleMode"
          >
            <span v-if="isScientificMode">Científico</span>
            <span v-else>Básico</span>
          </button>
        </div>
      </div>

      <div
        class="bg-slate-50 rounded-2xl p-6 mb-6 text-right border-2 border-slate-200"
      >
        <div class="text-base text-slate-500 min-h-6 mb-2 break-all">
          {{ currentFormula || "0" }}
        </div>
        <div class="text-3xl font-light text-slate-800 min-h-10 break-all">
          {{ displayValue }}
        </div>
      </div>

      <div class="flex flex-col gap-3">
        <template v-if="isScientificMode">
          <div class="grid grid-cols-5 gap-3">
            <button
              class="h-12 bg-purple-500 hover:bg-purple-600 text-white rounded-2xl text-sm font-medium transition-all duration-150 active:scale-95"
              @click="addFunction('sin(')"
            >
              sin
            </button>
            <button
              class="h-12 bg-purple-500 hover:bg-purple-600 text-white rounded-2xl text-sm font-medium transition-all duration-150 active:scale-95"
              @click="addFunction('cos(')"
            >
              cos
            </button>
            <button
              class="h-12 bg-purple-500 hover:bg-purple-600 text-white rounded-2xl text-sm font-medium transition-all duration-150 active:scale-95"
              @click="addFunction('tan(')"
            >
              tan
            </button>
            <button
              class="h-12 bg-purple-500 hover:bg-purple-600 text-white rounded-2xl text-sm font-medium transition-all duration-150 active:scale-95"
              @click="addFunction('log(')"
            >
              log
            </button>
            <button
              class="h-12 bg-purple-500 hover:bg-purple-600 text-white rounded-2xl text-sm font-medium transition-all duration-150 active:scale-95"
              @click="addFunction('ln(')"
            >
              ln
            </button>
          </div>
          <div class="grid grid-cols-6 gap-3">
            <button
              class="h-12 bg-purple-500 hover:bg-purple-600 text-white rounded-2xl text-sm font-medium transition-all duration-150 active:scale-95"
              @click="addFunction('√(')"
            >
              √
            </button>
            <button
              class="h-12 bg-purple-500 hover:bg-purple-600 text-white rounded-2xl text-sm font-medium transition-all duration-150 active:scale-95"
              @click="addOperator('^')"
            >
              x^y
            </button>
            <button
              class="h-12 bg-purple-500 hover:bg-purple-600 text-white rounded-2xl text-sm font-medium transition-all duration-150 active:scale-95"
              @click="addConstant('π')"
            >
              π
            </button>
            <button
              class="h-12 bg-purple-500 hover:bg-purple-600 text-white rounded-2xl text-sm font-medium transition-all duration-150 active:scale-95"
              @click="addConstant('e')"
            >
              e
            </button>
            <button
              class="h-12 bg-purple-500 hover:bg-purple-600 text-white rounded-2xl text-sm font-medium transition-all duration-150 active:scale-95"
              @click="addOperator('(')"
            >
              (
            </button>
            <button
              class="h-12 bg-purple-500 hover:bg-purple-600 text-white rounded-2xl text-sm font-medium transition-all duration-150 active:scale-95"
              @click="addOperator(')')"
            >
              )
            </button>
          </div>
        </template>

        <div class="grid grid-cols-4 gap-3">
          <button
            class="h-15 bg-red-500 hover:bg-red-600 text-white rounded-2xl text-lg font-medium transition-all duration-150 active:scale-95 flex items-center justify-center"
            @click="clearAll"
          >
            C
          </button>
          <button
            class="h-15 bg-red-500 hover:bg-red-600 text-white rounded-2xl text-lg font-medium transition-all duration-150 active:scale-95 flex items-center justify-center"
            @click="clearEntry"
          >
            CE
          </button>
          <button
            class="h-15 bg-red-500 hover:bg-red-600 text-white rounded-2xl text-lg font-medium transition-all duration-150 active:scale-95 flex items-center justify-center"
            @click="backspace"
          >
            ⌫
          </button>
          <button
            class="h-15 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl text-lg font-medium transition-all duration-150 active:scale-95 flex items-center justify-center"
            @click="addOperator('÷')"
          >
            ÷
          </button>
        </div>

        <div class="grid grid-cols-4 gap-3">
          <button
            class="h-15 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-lg font-medium transition-all duration-150 active:scale-95 flex items-center justify-center border-2 border-slate-200"
            @click="addNumber('7')"
          >
            7
          </button>
          <button
            class="h-15 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-lg font-medium transition-all duration-150 active:scale-95 flex items-center justify-center border-2 border-slate-200"
            @click="addNumber('8')"
          >
            8
          </button>
          <button
            class="h-15 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-lg font-medium transition-all duration-150 active:scale-95 flex items-center justify-center border-2 border-slate-200"
            @click="addNumber('9')"
          >
            9
          </button>
          <button
            class="h-15 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl text-lg font-medium transition-all duration-150 active:scale-95 flex items-center justify-center"
            @click="addOperator('×')"
          >
            ×
          </button>
        </div>

        <div class="grid grid-cols-4 gap-3">
          <button
            class="h-15 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-lg font-medium transition-all duration-150 active:scale-95 flex items-center justify-center border-2 border-slate-200"
            @click="addNumber('4')"
          >
            4
          </button>
          <button
            class="h-15 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-lg font-medium transition-all duration-150 active:scale-95 flex items-center justify-center border-2 border-slate-200"
            @click="addNumber('5')"
          >
            5
          </button>
          <button
            class="h-15 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-lg font-medium transition-all duration-150 active:scale-95 flex items-center justify-center border-2 border-slate-200"
            @click="addNumber('6')"
          >
            6
          </button>
          <button
            class="h-15 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl text-lg font-medium transition-all duration-150 active:scale-95 flex items-center justify-center"
            @click="addOperator('-')"
          >
            -
          </button>
        </div>

        <div class="grid grid-cols-4 gap-3">
          <button
            class="h-15 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-lg font-medium transition-all duration-150 active:scale-95 flex items-center justify-center border-2 border-slate-200"
            @click="addNumber('1')"
          >
            1
          </button>
          <button
            class="h-15 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-lg font-medium transition-all duration-150 active:scale-95 flex items-center justify-center border-2 border-slate-200"
            @click="addNumber('2')"
          >
            2
          </button>
          <button
            class="h-15 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-lg font-medium transition-all duration-150 active:scale-95 flex items-center justify-center border-2 border-slate-200"
            @click="addNumber('3')"
          >
            3
          </button>
          <button
            class="h-15 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl text-lg font-medium transition-all duration-150 active:scale-95 flex items-center justify-center"
            @click="addOperator('+')"
          >
            +
          </button>
        </div>

        <div class="grid grid-cols-3 gap-3">
          <button
            class="h-15 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-lg font-medium transition-all duration-150 active:scale-95 flex items-center justify-center border-2 border-slate-200 col-span-2"
            @click="addNumber('0')"
          >
            0
          </button>
          <button
            class="h-15 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-lg font-medium transition-all duration-150 active:scale-95 flex items-center justify-center border-2 border-slate-200"
            @click="addDecimal"
          >
            .
          </button>
        </div>

        <button
          class="h-15 bg-green-500 hover:bg-green-600 text-white rounded-2xl text-lg font-medium transition-all duration-150 active:scale-95 flex items-center justify-center w-full"
          @click="calculate"
        >
          =
        </button>
      </div>

      <div
        v-if="showHistory"
        class="mt-4 bg-slate-50 rounded-xl p-4 max-h-48 overflow-y-auto"
      >
        <div
          class="flex justify-between items-center mb-2 font-semibold text-slate-800"
        >
          <span>Histórico</span>
          <button
            class="text-red-500 hover:text-red-700 text-sm transition-colors"
            @click="clearHistory"
          >
            Limpar
          </button>
        </div>
        <div class="flex flex-col gap-1">
          <div
            v-for="(item, index) in history"
            :key="index"
            class="p-2 bg-white rounded-lg text-sm text-slate-600"
          >
            {{ item }}
          </div>
        </div>
      </div>

      <button
        class="w-full mt-4 py-3 bg-slate-500 hover:bg-slate-600 text-white rounded-xl text-sm font-medium transition-colors"
        @click="toggleHistory"
      >
        {{ showHistory ? "Ocultar Histórico" : "Mostrar Histórico" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $pwa } = useNuxtApp();

const displayValue = ref("0");
const currentFormula = ref("");
const isScientificMode = ref(false);
const showHistory = ref(false);
const history = ref<string[]>([]);
const lastResult = ref<number | null>(null);
const shouldResetDisplay = ref(false);

const toggleMode = () => {
  isScientificMode.value = !isScientificMode.value;
};

const toggleHistory = () => {
  showHistory.value = !showHistory.value;
};

const addNumber = (num: string) => {
  if (shouldResetDisplay.value) {
    displayValue.value = num;
    shouldResetDisplay.value = false;
  } else {
    displayValue.value =
      displayValue.value === "0" ? num : displayValue.value + num;
  }
  updateFormula();
};

const addDecimal = () => {
  if (shouldResetDisplay.value) {
    displayValue.value = "0.";
    shouldResetDisplay.value = false;
  } else if (!displayValue.value.includes(".")) {
    displayValue.value += ".";
  }
  updateFormula();
};

const addOperator = (op: string) => {
  if (op === "(" || op === ")") {
    currentFormula.value += op;
  } else {
    if (currentFormula.value && !isOperator(currentFormula.value.slice(-1))) {
      currentFormula.value += ` ${op} `;
    } else if (currentFormula.value) {
      currentFormula.value = currentFormula.value.slice(0, -3) + ` ${op} `;
    } else {
      currentFormula.value = displayValue.value + ` ${op} `;
    }
  }
  shouldResetDisplay.value = true;
};

const addFunction = (func: string) => {
  currentFormula.value += func;
  shouldResetDisplay.value = true;
};

const addConstant = (constant: string) => {
  const value = constant === "π" ? Math.PI.toString() : Math.E.toString();
  if (shouldResetDisplay.value || displayValue.value === "0") {
    displayValue.value = value;
  } else {
    displayValue.value += value;
  }
  currentFormula.value += constant;
  shouldResetDisplay.value = false;
};

const updateFormula = () => {
  if (!currentFormula.value || shouldResetDisplay.value) {
    currentFormula.value = displayValue.value;
  } else {
    const lastChar = currentFormula.value.slice(-1);
    if (!isOperator(lastChar) && lastChar !== "(" && lastChar !== ")") {
      const parts = currentFormula.value.split(/([+\-×÷^()])/);
      parts[parts.length - 1] = displayValue.value;
      currentFormula.value = parts.join("");
    } else {
      currentFormula.value += displayValue.value;
    }
  }
};

const isOperator = (char: string): boolean => {
  return ["+", "-", "×", "÷", "^"].includes(char.trim());
};

const clearAll = () => {
  displayValue.value = "0";
  currentFormula.value = "";
  shouldResetDisplay.value = false;
};

const clearEntry = () => {
  displayValue.value = "0";
};

const backspace = () => {
  if (displayValue.value.length > 1) {
    displayValue.value = displayValue.value.slice(0, -1);
  } else {
    displayValue.value = "0";
  }
  updateFormula();
};

const calculate = () => {
  try {
    let expression = currentFormula.value || displayValue.value;

    expression = expression
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/π/g, Math.PI.toString())
      .replace(/e/g, Math.E.toString())
      .replace(/sin\(/g, "Math.sin(")
      .replace(/cos\(/g, "Math.cos(")
      .replace(/tan\(/g, "Math.tan(")
      .replace(/log\(/g, "Math.log10(")
      .replace(/ln\(/g, "Math.log(")
      .replace(/√\(/g, "Math.sqrt(")
      .replace(/\^/g, "**");

    const result = Function(`"use strict"; return (${expression})`)();

    if (isNaN(result) || !isFinite(result)) {
      throw new Error("Erro de cálculo");
    }

    const formattedResult = Number(result.toFixed(10)).toString();

    history.value.unshift(`${currentFormula.value} = ${formattedResult}`);
    if (history.value.length > 20) {
      history.value = history.value.slice(0, 20);
    }

    displayValue.value = formattedResult;
    currentFormula.value = "";
    lastResult.value = result;
    shouldResetDisplay.value = true;
  } catch (error) {
    console.error(error);
    displayValue.value = "Erro";
    shouldResetDisplay.value = true;
  }
};

const clearHistory = () => {
  history.value = [];
};

watchEffect(() => {
  if ($pwa?.needRefresh) {
    const confirmUpdate = confirm("Nova versão disponível. Atualizar?");
    if (confirmUpdate) {
      $pwa.updateServiceWorker();
    }
  }
});
</script>
