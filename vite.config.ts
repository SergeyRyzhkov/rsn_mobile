import { defineConfig, loadEnv } from "vite";
import { fileURLToPath, URL } from "url";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default ({ mode }) => {
  return defineConfig({
    plugins: [vue(), ViteImageOptimizer()],

    define: {
      "process.env": { ...process.env, ...loadEnv("production", process.cwd()) },
    },

    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },

    server: {
      host: "0.0.0.0",
      // port: 3000,
    },

    build: {
      // target: "esnext",
      outDir: path.resolve(__dirname, "dist"),
      emptyOutDir: true,
      sourcemap: true,
    },

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "./src/assets/styles/_variables";`,
        },
      },
    },
  });
};
