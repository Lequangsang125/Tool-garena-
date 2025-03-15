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
    port: process.env.PORT || 3000, // Đảm bảo sử dụng cổng mà Render cấp
    host: '0.0.0.0', // Đảm bảo lắng nghe tất cả các IP
  },
});
