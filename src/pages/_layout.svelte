<!-- routify:options preload="proximity" -->
<script lang="ts">
  import { goto, url } from "@roxi/routify";
  import { useQuery } from "@sveltestack/svelte-query";
  import Config from "../config";
  import type { IUserPrivateInfo } from "../types";
  import TopBar from "./_components/TopBar.svelte";
  // import Footer from "./_components/Footer.svelte";
  import { get } from "../libs/fetcher";

  let allowed: boolean = false;
  const me = useQuery({
    queryKey: "me",
    queryFn: () => get<IUserPrivateInfo>("/users/-"),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  $: {
    allowed = Config.isAllowedPath($url());
    if (!(!Config.requireLogin || allowed || $me.isSuccess)) {
      sessionStorage.setItem("lastPage", $url());
      $goto("/intro");
    }
  }
</script>

<TopBar />
{#if Config.requireLogin === false || allowed === true || $me.isSuccess}
  <slot />
{/if}

<!-- <Footer /> -->
<style global>
  :root {
    /* == Light Theme == */
    --text-color: 21, 32, 43;
    --background-color: 255, 255, 255;
    --background-opacity: 0.05;

    /* == Others == */
    --link-color: 61, 90, 254;
    --error-color: 255, 82, 82;
    --content-max-width: 70rem;

    --font-family: "Apple SD Gothic Neo", "Noto Sans CJK KR", "Noto Sans KR", "본고딕", "KoPubDotum",
      "나눔바른고딕", "나눔고딕", "NanumBarunGothic", "NanumGothic", sans-serif;
    --font-family-monospace: "Menlo", "Noto Sans Mono CJK KR", "Monaco", "Hack", "Courier",
      "Courier New", "D2Coding ligature", "D2Coding", monospace;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      /* == Dark Theme == */
      --text-color: 255, 255, 255;
      --background-color: 20, 20, 20;
      --background-opacity: 0.035;

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
    vertical-align: middle;
  }
  body {
    font-family: var(--font-family);
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
  button,
  input {
    font-size: 1em;
  }
</style>
