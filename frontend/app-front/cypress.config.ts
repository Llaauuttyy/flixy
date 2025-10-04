import { defineConfig } from "cypress";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export default defineConfig({
  projectId: "f4p3ye",
  e2e: {
    baseUrl: process.env.CYPRESS_FRONT_URL,
    setupNodeEvents(on, config) {
      return config;
    },
  },
});
