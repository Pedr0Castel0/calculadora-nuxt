<template>
  <div class="category-selector">
    <!-- Desktop: Menu lateral -->
    <div class="hidden md:block w-64 bg-white rounded-2xl shadow-lg p-4 h-fit">
      <h3 class="text-lg font-semibold text-slate-800 mb-4">Categorias</h3>
      <div class="space-y-2">
        <button
          v-for="category in categories"
          :key="category.id"
          :class="{
            'bg-blue-500 text-white': selectedCategory?.id === category.id,
            'bg-slate-50 text-slate-700 hover:bg-slate-100':
              selectedCategory?.id !== category.id,
          }"
          class="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-150 text-left"
          @click="$emit('categorySelected', category)"
        >
          <span class="text-xl">{{ category.icon }}</span>
          <span class="font-medium">{{ category.name }}</span>
        </button>
      </div>
    </div>

    <!-- Mobile: Dropdown -->
    <div class="md:hidden">
      <button
        class="w-full bg-white rounded-2xl shadow-lg p-4 flex items-center justify-between"
        @click="showMobileMenu = !showMobileMenu"
      >
        <div class="flex items-center gap-3">
          <span class="text-xl">{{ selectedCategory?.icon || "📏" }}</span>
          <span class="font-medium text-slate-800">
            {{ selectedCategory?.name || "Selecionar Categoria" }}
          </span>
        </div>
        <span
          class="text-slate-400 transform transition-transform"
          :class="{ 'rotate-180': showMobileMenu }"
        >
          ▼
        </span>
      </button>

      <div
        v-if="showMobileMenu"
        class="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-80 overflow-y-auto"
      >
        <div class="p-2">
          <button
            v-for="category in categories"
            :key="category.id"
            :class="{
              'bg-blue-500 text-white': selectedCategory?.id === category.id,
              'text-slate-700 hover:bg-slate-50':
                selectedCategory?.id !== category.id,
            }"
            class="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-150 text-left"
            @click="selectMobileCategory(category)"
          >
            <span class="text-xl">{{ category.icon }}</span>
            <span class="font-medium">{{ category.name }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Category {
  id: string;
  name: string;
  icon: string;
  units: { [key: string]: { name: string; factor: number; offset?: number } };
}

interface Props {
  selectedCategory?: Category | null;
}

defineProps<Props>();
const emit = defineEmits<{
  categorySelected: [category: Category];
}>();

const showMobileMenu = ref(false);

const categories: Category[] = [
  {
    id: "length",
    name: "Comprimento",
    icon: "📏",
    units: {
      meter: { name: "Metro (m)", factor: 1 },
      kilometer: { name: "Quilômetro (km)", factor: 1000 },
      centimeter: { name: "Centímetro (cm)", factor: 0.01 },
      millimeter: { name: "Milímetro (mm)", factor: 0.001 },
      inch: { name: "Polegada (in)", factor: 0.0254 },
      foot: { name: "Pé (ft)", factor: 0.3048 },
      yard: { name: "Jarda (yd)", factor: 0.9144 },
      mile: { name: "Milha (mi)", factor: 1609.34 },
    },
  },
  {
    id: "weight",
    name: "Peso e Massa",
    icon: "⚖️",
    units: {
      kilogram: { name: "Quilograma (kg)", factor: 1 },
      gram: { name: "Grama (g)", factor: 0.001 },
      pound: { name: "Libra (lb)", factor: 0.453592 },
      ounce: { name: "Onça (oz)", factor: 0.0283495 },
      ton: { name: "Tonelada (t)", factor: 1000 },
      stone: { name: "Stone (st)", factor: 6.35029 },
    },
  },
  {
    id: "temperature",
    name: "Temperatura",
    icon: "🌡️",
    units: {
      celsius: { name: "Celsius (°C)", factor: 1, offset: 0 },
      fahrenheit: { name: "Fahrenheit (°F)", factor: 1.8, offset: 32 },
      kelvin: { name: "Kelvin (K)", factor: 1, offset: 273.15 },
    },
  },
  {
    id: "volume",
    name: "Volume",
    icon: "🥤",
    units: {
      liter: { name: "Litro (L)", factor: 1 },
      milliliter: { name: "Mililitro (mL)", factor: 0.001 },
      gallon_us: { name: "Galão US (gal)", factor: 3.78541 },
      gallon_uk: { name: "Galão UK (gal)", factor: 4.54609 },
      cup: { name: "Xícara (cup)", factor: 0.236588 },
      tablespoon: { name: "Colher de sopa (tbsp)", factor: 0.0147868 },
      teaspoon: { name: "Colher de chá (tsp)", factor: 0.00492892 },
    },
  },
  {
    id: "area",
    name: "Área",
    icon: "📐",
    units: {
      square_meter: { name: "Metro quadrado (m²)", factor: 1 },
      square_kilometer: { name: "Quilômetro quadrado (km²)", factor: 1000000 },
      square_centimeter: { name: "Centímetro quadrado (cm²)", factor: 0.0001 },
      hectare: { name: "Hectare (ha)", factor: 10000 },
      acre: { name: "Acre", factor: 4046.86 },
      square_foot: { name: "Pé quadrado (ft²)", factor: 0.092903 },
      square_inch: { name: "Polegada quadrada (in²)", factor: 0.00064516 },
    },
  },
  {
    id: "speed",
    name: "Velocidade",
    icon: "🚗",
    units: {
      mps: { name: "Metro por segundo (m/s)", factor: 1 },
      kmh: { name: "Quilômetro por hora (km/h)", factor: 0.277778 },
      mph: { name: "Milha por hora (mph)", factor: 0.44704 },
      knot: { name: "Nó (kn)", factor: 0.514444 },
      fps: { name: "Pé por segundo (ft/s)", factor: 0.3048 },
    },
  },
  {
    id: "energy",
    name: "Energia",
    icon: "⚡",
    units: {
      joule: { name: "Joule (J)", factor: 1 },
      kilojoule: { name: "Quilojoule (kJ)", factor: 1000 },
      calorie: { name: "Caloria (cal)", factor: 4.184 },
      kilocalorie: { name: "Quilocaloria (kcal)", factor: 4184 },
      watt_hour: { name: "Watt-hora (Wh)", factor: 3600 },
      kilowatt_hour: { name: "Quilowatt-hora (kWh)", factor: 3600000 },
    },
  },
  {
    id: "time",
    name: "Tempo",
    icon: "⏰",
    units: {
      second: { name: "Segundo (s)", factor: 1 },
      minute: { name: "Minuto (min)", factor: 60 },
      hour: { name: "Hora (h)", factor: 3600 },
      day: { name: "Dia", factor: 86400 },
      week: { name: "Semana", factor: 604800 },
      month: { name: "Mês", factor: 2629746 },
      year: { name: "Ano", factor: 31556952 },
    },
  },
  {
    id: "data",
    name: "Dados",
    icon: "💾",
    units: {
      byte: { name: "Byte (B)", factor: 1 },
      kilobyte: { name: "Quilobyte (KB)", factor: 1024 },
      megabyte: { name: "Megabyte (MB)", factor: 1048576 },
      gigabyte: { name: "Gigabyte (GB)", factor: 1073741824 },
      terabyte: { name: "Terabyte (TB)", factor: 1099511627776 },
      bit: { name: "Bit", factor: 0.125 },
    },
  },
  {
    id: "pressure",
    name: "Pressão",
    icon: "🌬️",
    units: {
      pascal: { name: "Pascal (Pa)", factor: 1 },
      kilopascal: { name: "Quilopascal (kPa)", factor: 1000 },
      bar: { name: "Bar", factor: 100000 },
      atmosphere: { name: "Atmosfera (atm)", factor: 101325 },
      psi: { name: "PSI", factor: 6894.76 },
      torr: { name: "Torr", factor: 133.322 },
    },
  },
];

const selectMobileCategory = (category: Category) => {
  showMobileMenu.value = false;
  emit("categorySelected", category);
};

// Fechar dropdown ao clicar fora
onMounted(() => {
  const handleClickOutside = (e: Event) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".category-selector")) {
      showMobileMenu.value = false;
    }
  };

  document.addEventListener("click", handleClickOutside);

  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
  });
});
</script>
