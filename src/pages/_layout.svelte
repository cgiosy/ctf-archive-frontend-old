<!-- routify:options preload="proximity" -->
<script lang="ts">
  import { goto } from "@roxi/routify";
  import Config from "../config";
  import { login } from "../stores";
  import TopBar from "./_components/TopBar.svelte";
  import Footer from "./_components/Footer.svelte";

  let allowed: boolean = false;

  $: {
    allowed = Config.isAllowedPath(location.pathname);
    if (!(!Config.requireLogin || allowed || $login)) {
      $goto("/intro");
    }
  }
</script>

<TopBar />
{#if !Config.requireLogin || allowed || $login}
  <slot />
{/if}
<Footer />

<style global>
  :root {
    /* == Light Theme == */
    --text-color: 21, 32, 43;
    --background-color: 255, 255, 255;
    --background-opacity: 0.05;
    --green: 16, 138, 16;

    /* == Others == */
    --link-color: 61, 90, 254;
    --content-max-width: 70rem;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      /* == Dark Theme == */
      --text-color: 255, 255, 255;
      --background-color: 20, 20, 20;
      --background-opacity: 0.05;
      --green: 20, 185, 20;

      /* == Black Theme == */
      /*
      --text-color: 255, 255, 255;
      --background-color: 0, 0, 0;
      --background-opacity: 0.1;
      */
    }
  }

  * {
    box-sizing: border-box;
  }
  body {
    font-family: "Open Sans", "arial", "Apple SD Gothic Neo", "Noto Sans CJK KR", "본고딕",
      "Noto Sans KR", "KoPubDotum", "나눔바른고딕", "나눔고딕", "NanumGothic", sans-serif;
    color: rgb(var(--text-color));
    background: rgb(var(--background-color));
    margin: 0;
    overflow-y: scroll;
  }
  main {
    margin-top: 3rem;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
</style>
