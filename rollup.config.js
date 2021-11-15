import svelte from "rollup-plugin-svelte-hot";
import Hmr from "rollup-plugin-hot";
import css from "rollup-plugin-css-only";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { copySync, removeSync } from "fs-extra";
import getConfig from "@roxi/routify/lib/utils/config";
import sveltePreprocess from "svelte-preprocess";
import postcssImport from "postcss-import";
import { injectManifest } from "rollup-plugin-workbox";

const { distDir } = getConfig(); // use Routify's distDir for SSOT
const publicDir = "public";
const buildDir = `${distDir}/assets`;
const production = !process.env.ROLLUP_WATCH;

removeSync(distDir);

const copyToDistAndExit = () => ({
  writeBundle() {
    copySync(publicDir, distDir);
    process.exit();
  },
});

export default {
  preserveEntrySignatures: false,
  input: ["src/main.ts"],
  output: {
    sourcemap: !production,
    format: "esm",
    dir: buildDir,
    // for performance, disabling filename hashing in development
    chunkFileNames: `[name]${(production && "-[hash]") || ""}.js`,
    /*
    manualChunks() {
      return "main";
    },
    */
  },
  plugins: [
    svelte({
      emitCss: production,
      hot: !production,
      compilerOptions: {
        css: !production,
        dev: !production,
        hydratable: false,
      },
      preprocess: [
        sveltePreprocess({
          sourceMap: !production,
          postcss: {
            extract: true,
            plugins: [postcssImport()],
          },
          defaults: { style: "postcss" },
        }),
      ],
    }),
    css({ output: `main.css` }),

    resolve({
      browser: true,
      dedupe: (importee) => !!importee.match(/svelte(\/|$)/),
    }),
    commonjs(),
    typescript({
      sourceMap: !production,
      inlineSources: !production,
    }),

    production && terser(),
    !production && Hmr({ inMemory: true, public: publicDir }),
    {
      // provide node environment on the client
      transform: (code) => ({
        code: code.replace("process.env.NODE_ENV", `"${process.env.NODE_ENV}"`),
        map: { mappings: "" },
      }),
    },
    injectManifest({
      globDirectory: publicDir,
      globPatterns: ["**/*.{js,css,svg}", "index.html"],
      swSrc: `src/sw.js`,
      swDest: `${buildDir}/serviceworker.js`,
      maximumFileSizeToCacheInBytes: 16 * 1024 * 1024,
      mode: "production",
    }),
    production && copyToDistAndExit(),
  ],
  watch: {
    clearScreen: false,
    buildDelay: 100,
  },
};
