import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 가장 큰 문제인 React만 분리
          "react-vendor": ["react", "react-dom", "react-router-dom"],
        },
      },
    },
    chunkSizeWarningLimit: 700, // 조금 더 여유롭게
  },
});
