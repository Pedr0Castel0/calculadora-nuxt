<template>
  <div>Index</div>
</template>

<script setup lang="ts">
const { $pwa } = useNuxtApp();

watchEffect(() => {
  if ($pwa?.offlineReady) {
    alert("O app está pronto para funcionar offline!");
  }

  if ($pwa?.needRefresh) {
    const confirmUpdate = confirm("Nova versão disponível. Atualizar?");
    if (confirmUpdate) {
      $pwa.updateServiceWorker();
    }
  }
});
</script>
