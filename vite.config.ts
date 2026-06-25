import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.VERCEL ? "/" : "/moro-ai-enterprise/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
