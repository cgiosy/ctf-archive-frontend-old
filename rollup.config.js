import svelte from "rollup-plugin-svelte-hot";
import Hmr from "rollup-plugin-hot";
import css from "rollup-plugin-css-only";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { copySync, removeSync } from "fs-extra";
// import { spassr } from "spassr";
import getConfig from "@roxi/routify/lib/utils/config";
import sveltePreprocess from "svelte-preprocess";
import postcssImport from "postcss-import";
import { injectManifest } from "rollup-plugin-workbox";

const { distDir } = getConfig(); // use Routify's distDir for SSOT
const publicDir = "public";
const buildDir = `${distDir}/assets`;
const isNollup = !!process.env.NOLLUP;
const production = !process.env.ROLLUP_WATCH;

removeSync(buildDir);
removeSync(distDir);

const serve = () => ({
  writeBundle: async () => {
    const options = {
      assetsDir: [publicDir, distDir],
      entrypoint: `${publicDir}/index.html`,
      script: `${buildDir}/main.js`,
    };
    /*
    spassr({ ...options, port: 5000 });
    spassr({
      ...options,
      ssr: true,
      port: 5005,
      ssrOptions: { inlineDynamicImports: true, dev: true },
    });
    */
  },
});

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
    manualChunks() {
      return "main";
    },
  },
  plugins: [
    svelte({
      emitCss: !(!production && isNollup),
      hot: isNollup,
      compilerOptions: {
        css: !production && isNollup,
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

    // resolve matching modules from current working directory
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
    !production && !isNollup && serve(),
    !production && !isNollup && livereload(distDir), // refresh entire window when code is updated
    !production && isNollup && Hmr({ inMemory: true, public: publicDir }), // refresh only updated code
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
      maximumFileSizeToCacheInBytes: 10000000, // 10 MB,
      mode: "production",
    }),
    production && copyToDistAndExit(),
  ],
  watch: {
    clearScreen: false,
    buildDelay: 100,
  },
};
