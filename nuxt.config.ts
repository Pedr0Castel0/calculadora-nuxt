import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: false },

  modules: ["@nuxt/eslint", "@vite-pwa/nuxt"],
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  pwa: {
    registerType: "autoUpdate",
    devOptions: {
      enabled: true,
      type: "module",
    },
    manifest: {
      name: "Calculadora PWA",
      short_name: "Calculadora",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
    },
  },
});
