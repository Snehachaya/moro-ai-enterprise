import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/moro-ai-enterprise/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
