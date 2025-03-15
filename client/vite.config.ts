import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        // This will transform your SVG to a React component
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  server: {
    port: process.env.PORT || 4000,  // Ensure using Render's provided port
    host: '0.0.0.0', // Listen on all IPs
    allowedHosts: [
      'tool-garena-v1-lqs.onrender.com', // Add this host to the allowed list
    ],
  },
});
