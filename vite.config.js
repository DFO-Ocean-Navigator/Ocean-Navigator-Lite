import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import path from "path";

export default defineConfig({
//   root: "src",

  plugins: [react()],
//    build: {outDir: '../public'}
//   resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
