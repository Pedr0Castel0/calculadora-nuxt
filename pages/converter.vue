<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 p-2 sm:p-4 font-sans"
  >
    <div class="max-w-7xl mx-auto">
      <!-- Header com navegação -->
      <div
        class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 sm:gap-4">
            <NuxtLink
              to="/"
              class="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg sm:rounded-xl transition-colors text-sm"
            >
              <span>←</span>
              <span class="font-medium hidden xs:inline">Calculadora</span>
              <span class="font-medium xs:hidden">Calc</span>
            </NuxtLink>
            <div class="h-4 sm:h-6 w-px bg-slate-300"></div>
            <div class="flex items-center gap-2 sm:gap-3">
              <span class="text-xl sm:text-2xl">🔄</span>
              <h1 class="text-lg sm:text-2xl font-semibold text-slate-800">
                <span class="hidden sm:inline">Conversor de Unidades</span>
                <span class="sm:hidden">Conversor</span>
              </h1>
            </div>
          </div>

          <!-- Indicador PWA -->
          <div class="hidden sm:flex items-center gap-2 text-sm text-slate-600">
            <span class="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>PWA Ativo</span>
          </div>
        </div>
      </div>

      <!-- Conversor principal -->
      <UnitConverter />
    </div>
  </div>
</template>

<script setup lang="ts">
import UnitConverter from "~/components/UnitConverter.vue";

const { $pwa } = useNuxtApp();

// Configurar meta tags para SEO
useHead({
  title: "Conversor de Unidades - Calculator PWA",
  meta: [
    {
      name: "description",
      content:
        "Conversor de unidades moderno e responsivo. Converta comprimento, peso, temperatura, volume e muito mais.",
    },
  ],
});

// Configurar PWA
watchEffect(() => {
  if ($pwa?.needRefresh) {
    const confirmUpdate = confirm("Nova versão disponível. Atualizar?");
    if (confirmUpdate) {
      $pwa.updateServiceWorker();
    }
  }
});
</script>
