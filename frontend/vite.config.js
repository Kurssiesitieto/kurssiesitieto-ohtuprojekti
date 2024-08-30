import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config();

const inDeployment = process.env.DEPLOYMENT === "true";
const devPort = process.env.VITE_DEV_PORT
  ? parseInt(process.env.VITE_DEV_PORT, 10)
  : 3001;
console.log("VITE_DEV_PORT:", devPort);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: inDeployment ? "/esitieto" : "/",
  server: {
    proxy: {
      "/api/": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
    },
    watch: {
      usePolling: true,
    },
    host: true,
    strictPort: true,
    port: devPort || 3001,
  },
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "json"],
      reportOnFailure: true,
    },
  },
});
