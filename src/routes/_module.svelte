<!-- routify:options preload="proximity" -->
<script lang="ts">
  import { isLoading } from "svelte-i18n";
  import { goto } from "@roxi/routify";
  import Config from "../config";
  import TopBar from "./_components/TopBar.svelte";
  import { themeMode, useSessionid } from "../queries";
  // import Footer from "./_components/Footer.svelte";

  let allowed: boolean = false;
  const [sessionid] = useSessionid();
  let signedIn = false;

  themeMode.set(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    console.log(e.matches);
    themeMode.set(e.matches ? "dark" : "light");
  });

  $: signedIn = !!$sessionid.data;
  $: {
    const path = location.pathname;
    if (path !== "signin" && path !== "/signin") sessionStorage.setItem("lastPage", path);
    allowed = Config.isAllowedPath(path);
    if (allowed === false && !signedIn) {
      location.href = "/signin";
    }
  }
</script>

{#if !$isLoading}
  <TopBar />
  {#if allowed === true || signedIn}
    <slot />
  {/if}
{/if}

<style global>
  :root {
    /* == Light Theme == */
    --text-color: 0, 0, 0;
    --background-color: 255, 255, 255;
    --background-opacity: 0.046875;

    /* == Others == */
    --link-color: 61, 90, 254;
    --error-color: 255, 82, 82;
    --content-max-width: 70rem;

    --font-family: "Pretendard", "Apple SD Gothic Neo", "Noto Sans CJK KR", "Noto Sans KR", "본고딕",
      "KoPubDotum", "나눔바른고딕", "나눔고딕", "NanumBarunGothic", "NanumGothic", sans-serif;
    --font-family-monospace: "Menlo", "Noto Sans Mono CJK KR", "Monaco", "Hack", "D2Coding ligature",
      "D2 Coding ligature", "D2Coding", "D2 Coding", "Consolas", var(--font-family), monospace;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      /* == Dark Theme == */
      --text-color: 255, 255, 255;
      --background-color: 20, 20, 20;
      --background-opacity: 0.03515625;
      /* --background-opacity: 0.0390625; */

      /* == Black Theme == */
      /*
      --text-color: 255, 255, 255;
      --background-color: 0, 0, 0;
      --background-opacity: 0.01171875;
      */
    }
  }

  * {
    box-sizing: border-box;
    vertical-align: middle;
  }
  *,
  *:hover,
  *:active {
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  }
  *:focus {
    outline: none;
  }
  body {
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
  body,
  button,
  input,
  textarea {
    color: rgba(var(--text-color), calc(var(--background-opacity) * 25));
    font-family: var(--font-family);
    font-size: 1em;
  }
</style>
