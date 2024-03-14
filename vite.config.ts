import { defineConfig, loadEnv } from "vite";
import { fileURLToPath, URL } from "url";
import vue from "@vitejs/plugin-vue";
import path from "path";

// const externals = [
//   "react",
//   "firebase",
//   "firebase/app",
//   "firebase/firestore",
//   "firebase/firestore/lite",
//   "firebase/auth",
//   "firebase/functions",
//   "firebase/storage",
//   "firebase/database",
//   "firebase/remote-config",
//   "firebase/performance",
//   "@firebase/app",
//   "@firebase/firestore",
//   "@firebase/firestore/lite",
//   "@firebase/auth",
//   "@firebase/functions",
//   "@firebase/storage",
//   "@firebase/database",
//   "@firebase/remote-config",
//   "@firebase/performance",
// ];

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
