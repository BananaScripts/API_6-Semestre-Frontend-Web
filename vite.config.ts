import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
<<<<<<< Updated upstream
    port: 8080,
=======
    port: 5173,
    proxy: {
      // Proxy das chamadas começando com /api para o backend FastAPI
      '/api': {
        target: 'http://192.168.1.7:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
>>>>>>> Stashed changes
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
