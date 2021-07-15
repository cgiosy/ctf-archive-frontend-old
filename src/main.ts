// @ts-expect-error
import HMR from "@roxi/routify/hmr";
// @ts-expect-error
import App from "./App.svelte";

const app = HMR(App, { target: document.body }, "ctf-archive");

export default app;
