import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: '0.0.0.0',  // Ensure Vite is accessible from outside the container
    port: 8000,
    hmr: {
      host: '192.168.178.149',  // Replace with the IP address of the host (Docker host machine)
      protocol: 'ws',  // Use WebSocket protocol
    },
    watch: {
      usePolling: true,  // Use polling to watch for file changes (helps with some network configurations)
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
