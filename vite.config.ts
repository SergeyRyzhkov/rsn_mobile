import { defineConfig, loadEnv } from "vite";
import { fileURLToPath, URL } from "url";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default ({ mode }) => {
  process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  const config = defineConfig({
    plugins: [vue()],

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

  // if (!!process.env.VITE_CAPACITOR_LIVE) {
  //   config.server = {
  //     port: 8100,
  //     host: "192.168.0.103",
  //   };
  // }

  return config;
};
