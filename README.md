# Calculadora PWA — Nuxt 3 + TailwindCSS + Vite PWA

Aplicativo de calculadora científica responsiva, desenvolvido com Nuxt 3, TailwindCSS e suporte completo a Progressive Web App (PWA).

🔗 Acesse em produção: [calculadora-nuxt-pwa.vercel.app](https://calculadora-nuxt-pwa.vercel.app)

## 🚀 Tecnologias

- [Nuxt 3](https://nuxt.com/)
- [TailwindCSS v4](https://tailwindcss.com)
- [@vite-pwa/nuxt](https://vite-pwa-org.netlify.app/frameworks/nuxt)
- [Vercel](https://vercel.com/) para deploy

---

## ⚙️ Setup

Instale as dependências do projeto:

```bash
# npm
npm install
# ou
yarn install
# ou
pnpm install
# ou
bun install
````

---

## 🧪 Desenvolvimento

Inicie o servidor de desenvolvimento em `http://localhost:3000`:

```bash
# npm
npm run dev
```

---

## 📦 Produção

Construa o projeto para produção:

```bash
npm run build
```

Visualize localmente o build de produção:

```bash
npm run preview
```

---

## 📲 Funcionalidades PWA

Este projeto já está configurado como um Progressive Web App com:

* `registerType: 'autoUpdate'` para atualizações automáticas
* `manifest.webmanifest` com nome, descrição, ícones e screenshots
* Compatibilidade com instalação em dispositivos móveis e desktop

Verifique no DevTools → **Application** se o service worker e o manifest estão ativos.

---

## 📁 Estrutura de Pastas Relevante

```
public/
├─ pwa-icon-192x192.png
├─ pwa-icon-512x512.png
└─ screenshots/
   ├─ calc-wide.png
   └─ calc-narrow.png
```

---

## 📤 Deploy

O deploy contínuo está configurado na [Vercel](https://vercel.com/). Saiba mais na [documentação de deploy do Nuxt](https://nuxt.com/docs/getting-started/deployment).

---

## 📜 Licença

Este projeto é open-source e pode ser adaptado livremente para fins educacionais ou pessoais.

