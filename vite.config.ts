import { defineConfig, loadEnv } from "vite";
import { fileURLToPath, URL } from "url";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default ({ mode }) => {
  return defineConfig({
    plugins: [vue()],

    define: {
      "process.env": { ...process.env, ...loadEnv("production", process.cwd()) },
    },

    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },

    server: {
      // port: 8100,
      // host: "192.168.0.103",
      //http://192.168.1.68:8100
    },

    build: {
      outDir: path.resolve(__dirname, "dist"),
      emptyOutDir: true,
      // sourcemap: true,
      // rollupOptions: {
      //   external: externals,
      // },
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
