import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": "./app-front",
    },
  },
  // Permite que Vite escuche en 0.0.0.0 y se pueda acceder en modo dev
  // desde afuera del container.
  server: {
    host: true,
    port: 3000,
  },
});
