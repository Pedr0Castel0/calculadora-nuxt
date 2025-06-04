<template>
  <div class="unit-converter">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 h-full">
      <!-- Seletor de categorias -->
      <div class="md:col-span-1">
        <CategorySelector
          :selected-category="selectedCategory"
          @category-selected="onCategorySelected"
        />
      </div>

      <!-- Área principal de conversão -->
      <div class="md:col-span-3 space-y-6">
        <!-- Cabeçalho da categoria -->
        <div v-if="selectedCategory" class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-2xl">{{ selectedCategory.icon }}</span>
            <h2 class="text-2xl font-semibold text-slate-800">
              {{ selectedCategory.name }}
            </h2>
          </div>
          <p class="text-slate-600">
            Converta entre diferentes unidades de
            {{ selectedCategory.name.toLowerCase() }}
          </p>
        </div>

        <div
          v-if="selectedCategory"
          class="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <!-- Campo de entrada -->
          <div class="space-y-4">
            <UnitInput
              label="De"
              :value="fromValue"
              :selected-unit="fromUnit"
              :units="selectedCategory.units"
              @value-change="onFromValueChange"
              @unit-change="onFromUnitChange"
            />

            <!-- Botão de inversão -->
            <div class="flex justify-center">
              <button
                title="Inverter unidades"
                :disabled="!fromUnit || !toUnit"
                class="p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white rounded-xl transition-colors"
                @click="swapUnits"
              >
                <Icon name="lets-icons:horizontal-switch-light" />
              </button>
            </div>

            <UnitInput
              label="Para"
              :value="toValue"
              :selected-unit="toUnit"
              :units="selectedCategory.units"
              @value-change="onToValueChange"
              @unit-change="onToUnitChange"
            />
          </div>

          <!-- Resultado -->
          <div>
            <ConversionResult
              :result="convertedResult"
              :result-unit="toUnit"
              :units="selectedCategory.units"
              :conversion-formula="conversionFormula"
              :show-history="true"
              :history="conversionHistory"
              @clear-history="clearHistory"
            />
          </div>
        </div>

        <!-- Estado inicial -->
        <div v-else class="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div class="text-6xl mb-4">🔄</div>
          <h3 class="text-xl font-semibold text-slate-800 mb-2">
            Conversor de Unidades
          </h3>
          <p class="text-slate-600">
            Selecione uma categoria para começar a converter
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CategorySelector from "./CategorySelector.vue";
import UnitInput from "./UnitInput.vue";
import ConversionResult from "./ConversionResult.vue";

interface Category {
  id: string;
  name: string;
  icon: string;
  units: { [key: string]: { name: string; factor: number; offset?: number } };
}

const selectedCategory = ref<Category | null>(null);
const fromValue = ref("1");
const toValue = ref("0");
const fromUnit = ref<string | null>(null);
const toUnit = ref<string | null>(null);
const convertedResult = ref<number | null>(null);
const conversionHistory = ref<string[]>([]);
const lastConversionDirection = ref<"from" | "to">("from");

const conversionFormula = computed(() => {
  if (!selectedCategory.value || !fromUnit.value || !toUnit.value) return "";

  const fromUnitData = selectedCategory.value.units[fromUnit.value];
  const toUnitData = selectedCategory.value.units[toUnit.value];

  if (selectedCategory.value.id === "temperature") {
    return getTemperatureFormula(fromUnit.value, toUnit.value);
  }

  const ratio = fromUnitData.factor / toUnitData.factor;
  return `1 ${fromUnitData.name} = ${ratio.toFixed(6)} ${toUnitData.name}`;
});

const onCategorySelected = (category: Category) => {
  selectedCategory.value = category;

  // Selecionar primeiras unidades automaticamente
  const unitKeys = Object.keys(category.units);
  if (unitKeys.length >= 2) {
    fromUnit.value = unitKeys[0];
    toUnit.value = unitKeys[1];
    performConversion();
  }
};

const onFromValueChange = (value: string) => {
  fromValue.value = value;
  lastConversionDirection.value = "from";
  performConversion();
};

const onToValueChange = (value: string) => {
  toValue.value = value;
  lastConversionDirection.value = "to";
  performConversion();
};

const onFromUnitChange = (unit: string) => {
  fromUnit.value = unit;
  performConversion();
};

const onToUnitChange = (unit: string) => {
  toUnit.value = unit;
  performConversion();
};

const swapUnits = () => {
  if (!fromUnit.value || !toUnit.value) return;

  const tempUnit = fromUnit.value;
  fromUnit.value = toUnit.value;
  toUnit.value = tempUnit;

  const tempValue = fromValue.value;
  fromValue.value = toValue.value;
  toValue.value = tempValue;

  performConversion();
};

const performConversion = () => {
  if (!selectedCategory.value || !fromUnit.value || !toUnit.value) return;

  const sourceValue =
    lastConversionDirection.value === "from" ? fromValue.value : toValue.value;
  const sourceUnit =
    lastConversionDirection.value === "from" ? fromUnit.value : toUnit.value;
  const targetUnit =
    lastConversionDirection.value === "from" ? toUnit.value : fromUnit.value;

  const numericValue = parseFloat(sourceValue);
  if (isNaN(numericValue)) return;

  let result: number;

  if (selectedCategory.value.id === "temperature") {
    result = convertTemperature(numericValue, sourceUnit, targetUnit);
  } else {
    result = convertStandardUnits(numericValue, sourceUnit, targetUnit);
  }

  convertedResult.value = result;

  if (lastConversionDirection.value === "from") {
    toValue.value = result.toString();
  } else {
    fromValue.value = result.toString();
  }

  // Adicionar ao histórico
  addToHistory(numericValue, sourceUnit, result, targetUnit);
};

const convertStandardUnits = (
  value: number,
  fromUnitKey: string,
  toUnitKey: string
): number => {
  const units = selectedCategory.value!.units;
  const fromUnit = units[fromUnitKey];
  const toUnit = units[toUnitKey];

  // Converter para unidade base primeiro, depois para unidade de destino
  const baseValue = value * fromUnit.factor;
  return baseValue / toUnit.factor;
};

const convertTemperature = (
  value: number,
  fromUnitKey: string,
  toUnitKey: string
): number => {
  // Converter para Celsius primeiro (unidade base)
  let celsius: number;

  switch (fromUnitKey) {
    case "celsius":
      celsius = value;
      break;
    case "fahrenheit":
      celsius = (value - 32) / 1.8;
      break;
    case "kelvin":
      celsius = value - 273.15;
      break;
    default:
      celsius = value;
  }

  // Converter de Celsius para unidade de destino
  switch (toUnitKey) {
    case "celsius":
      return celsius;
    case "fahrenheit":
      return celsius * 1.8 + 32;
    case "kelvin":
      return celsius + 273.15;
    default:
      return celsius;
  }
};

const getTemperatureFormula = (fromUnit: string, toUnit: string): string => {
  if (fromUnit === "celsius" && toUnit === "fahrenheit") {
    return "°F = °C × 1.8 + 32";
  } else if (fromUnit === "fahrenheit" && toUnit === "celsius") {
    return "°C = (°F - 32) ÷ 1.8";
  } else if (fromUnit === "celsius" && toUnit === "kelvin") {
    return "K = °C + 273.15";
  } else if (fromUnit === "kelvin" && toUnit === "celsius") {
    return "°C = K - 273.15";
  } else if (fromUnit === "fahrenheit" && toUnit === "kelvin") {
    return "K = (°F - 32) ÷ 1.8 + 273.15";
  } else if (fromUnit === "kelvin" && toUnit === "fahrenheit") {
    return "°F = (K - 273.15) × 1.8 + 32";
  }
  return "";
};

const addToHistory = (
  fromVal: number,
  fromUnit: string,
  toVal: number,
  toUnit: string
) => {
  const fromUnitName = selectedCategory.value!.units[fromUnit].name;
  const toUnitName = selectedCategory.value!.units[toUnit].name;

  const historyItem = `${fromVal} ${fromUnitName} = ${toVal.toFixed(
    6
  )} ${toUnitName}`;

  conversionHistory.value.unshift(historyItem);
  if (conversionHistory.value.length > 20) {
    conversionHistory.value = conversionHistory.value.slice(0, 20);
  }
};

const clearHistory = () => {
  conversionHistory.value = [];
};
</script>
