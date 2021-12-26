import fs from "fs";
import { defineConfig } from "vite";
import sveltePreprocess from "svelte-preprocess";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import routify from "@roxi/routify/vite-plugin";
import { XXHash3 } from "xxhash-addon";
import htmlMinifier from "html-minifier";

export default defineConfig(() => {
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
      {
        name: "hash-font-url",
        transformIndexHtml: (html) =>
          html.replace(/url\(['"]?(.+?\.woff2?)['"]?\)/g, (mat, path) => {
            const data = fs.readFileSync(`./public/${path}`);
            const hash = new XXHash3(data).digest().toString("hex").slice(0, 8);
            return mat.replace(path, path + "?v=" + hash);
          }),
      },
      {
        name: "minify-html",
        transformIndexHtml: (html) =>
          htmlMinifier.minify(html, {
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            decodeEntities: true,
            maxLineLength: 0,
            minifyCSS: true,
            minifyJS: true,
            processConditionalComments: true,
            processScripts: ["text/html"],
            removeAttributeQuotes: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            sortAttributes: true,
            sortClassName: true,
            trimCustomFragments: true,
            useShortDoctype: true,
          }),
      },
    ],
    rollupdedupe: ["svelte"],
  };
});
