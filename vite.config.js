import fs from "fs";
import { defineConfig } from "vite";
import sveltePreprocess from "svelte-preprocess";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import routify from "@roxi/routify/vite-plugin";

export default defineConfig(({ command }) => {
  const production = process.env.NODE_ENV === "production";
  return {
    json: {
      stringify: true,
    },

    server: {
      https: {
        key: fs.readFileSync("localhost-key.pem"),
        cert: fs.readFileSync("localhost.pem"),
      },
      proxy: {
        "/api": {
          target: "https://ctf-archive.com/api",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
      origin: "https://ctf-archive.com/",
    },

    build: {
      emptyOutDir: true,
      // cssCodeSplit: false,
      sourcemap: !production,
      minify: production ? "terser" : "esbuild",
      terserOptions: production
        ? {
            ecma: 2020,
            compress: {
              passes: 2,
            },
          }
        : undefined,
    },

    plugins: [
      routify({
        extensions: [".svelte"],
      }),
      svelte({
        preprocess: [
          sveltePreprocess({
            sourceMap: !production,
          }),
        ],
      }),
    ],
    rollupdedupe: ["svelte"],
  };
});
