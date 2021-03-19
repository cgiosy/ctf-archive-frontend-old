<script lang="ts">
  import Logo from "./_components/Logo.svelte";
  import LevelIcon from "./_components/LevelIcon.svelte";

  /*
  import { goto } from "@roxi/routify";
  if (!document.cookie.includes("SESSION_COOKIE")) {
    $goto("/intro");
  }
  */

  const isCategory = (query: string): boolean =>
    ["web", "pwn", "rev", "crypto", "fore", "misc"].includes(query);
  const isDifficulty = (query: string): boolean => query.match(/^[bsgpd][1-5]$/m) !== null;
  const getQueryType = (query: string): string => {
    const typeList = [
      { check: isDifficulty, name: "difficulty" },
      { check: isCategory, name: "category" },
    ];
    for (let { check, name } of typeList) {
      if (check(query)) {
        return name;
      }
    }
    return "";
  };

  let queries: string[] = ["web", "d5", "ssti"];
  let lastQuery: string = "";

  $: {
    if (lastQuery !== "") {
      queries.push(lastQuery);
      lastQuery = "";
    }
  }

  $: {
    queries = queries.filter((query) => query.trim() !== "");
  }
</script>

<main>
  <header>
    <div class="search-logo">
      <Logo />
    </div>
    <ul class="search-bar">
      {#each queries as query}
        <li>
          {#if false && isDifficulty(query)}
            <i class={`icon-${query}`} />
          {/if}
          <input type="text" class={getQueryType(query)} bind:value={query} />
        </li>
      {/each}
      <li>
        <input type="text" bind:value={lastQuery} placeholder="검색어" />
      </li>
    </ul>
  </header>
  <ul>
    <li><LevelIcon level={6} categories={["misc"]} /></li>
    <li><LevelIcon level={17} categories={["web", "crypto"]} /></li>
    <li><LevelIcon level={29} categories={["pwn", "rev", "fore"]} /></li>
  </ul>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 3rem;
  }
  main,
  header,
  section {
    contain: content;
  }
  header {
    width: 100%;
    max-width: var(--content-max-width);
    padding: 2rem 1rem;
  }
  ul {
    list-style-type: none;
  }
  .search-bar {
    display: flex;
    padding: 1rem;
    border: 1px solid rgba(var(--text-color), calc(var(--background-opacity) * 5));
    border-radius: 0.5rem;
    transition: box-shadow 0.1s;
  }
  .search-bar:hover {
    box-shadow: 0 0.1rem 0.4rem 0 rgba(var(--text-color), calc(var(--background-opacity) * 3));
  }
  li > input {
    width: 6rem;
    border: none;
    border-radius: 1rem;
    padding: 0.5em;
    margin: 0 0.25em;
    text-align: center;
    background-color: rgba(var(--text-color), calc(var(--background-opacity) * 2));
  }
  li > input:focus {
    outline: none;
  }
  .search-logo {
    font-size: 3rem;
    margin-bottom: 2rem;
  }
  .category {
    color: white;
    background-color: #2962ff;
  }
  .difficulty {
    color: white;
    background-color: #263238;
  }
</style>
