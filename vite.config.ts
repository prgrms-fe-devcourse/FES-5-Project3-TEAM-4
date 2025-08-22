import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
const viteConfig = defineConfig({
  base: "/",
  server: {
    host: "localhost",
    port: 3000,
    open: false,
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});

export default viteConfig;
