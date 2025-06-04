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
              <span class="text-xl sm:text-2xl">📊</span>
              <h1 class="text-lg sm:text-2xl font-semibold text-slate-800">
                <span class="hidden sm:inline">Tabelas Técnicas</span>
                <span class="sm:hidden">Tabelas</span>
              </h1>
            </div>
          </div>

          <!-- Links adicionais -->
          <div class="flex items-center gap-2">
            <NuxtLink
              to="/converter"
              class="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg sm:rounded-xl transition-colors text-xs sm:text-sm font-medium"
              title="Conversor de Unidades"
            >
              <span>🔄</span>
              <span class="hidden xs:inline">Conversor</span>
            </NuxtLink>

            <!-- Indicador PWA -->
            <div
              class="hidden sm:flex items-center gap-2 text-sm text-slate-600"
            >
              <span class="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>PWA Ativo</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Layout das tabelas -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        <!-- Seletor de tabelas -->
        <div class="lg:col-span-1">
          <TableSelector
            :selected-table="selectedTable"
            @table-selected="onTableSelected"
          />
        </div>

        <!-- Área principal das tabelas -->
        <div class="lg:col-span-3">
          <TechTables
            :selected-table="selectedTable"
            @table-selected="onTableSelected"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TechTables from "~/components/TechTables.vue";
import TableSelector from "~/components/TableSelector.vue";

interface TechnicalTable {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  icon: string;
  hasUnitSwitcher: boolean;
  data: Record<string, any>[];
  columns: any[];
}

const selectedTable = ref<TechnicalTable | null>(null);

const { $pwa } = useNuxtApp();

const onTableSelected = (table: TechnicalTable) => {
  selectedTable.value = table;
};

// Configurar meta tags para SEO
useHead({
  title: "Tabelas Técnicas - Calculator PWA",
  meta: [
    {
      name: "description",
      content:
        "Tabelas técnicas de referência para engenheiros e técnicos. Frações, vapor, materiais, torque e conexões.",
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