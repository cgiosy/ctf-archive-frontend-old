<script lang="ts">
  import Logo from "./_components/Logo.svelte";
  import ProblemCard from "./_components/ProblemCard.svelte";

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

  const problems = [
    {
      level: 6,
      categories: ["misc"],
      title: "baby ssti",
      source: "Hyp3rFlow - cgiosy",
      solves: 8396,
    },
    {
      level: 17,
      categories: ["pwn"],
      title: "Welcome to The Friendzone",
      source: "Tenable CTF 2021",
      solves: 185,
    },
    {
      level: 29,
      categories: ["web", "crypto"],
      title: "baby webrypto",
      source: "Hyp3rFlow - Ryute",
      solves: 41,
    },
    {
      level: 30,
      categories: ["pwn", "rev", "fore"],
      title: "baby forevpwn",
      source: "Hyp3rFlow - L0TUS",
      solves: 37,
    },
    {
      level: 99,
      categories: ["pwn", "rev", "crypto", "web", "fore", "misc"],
      title:
        "SUPER SUPER BINARY SEARCH DELUXE 2.5: THE LEGEND OF THE GOLDEN MAZASSUMNIDA, EPISODE 2: THE MAZWAETL UNIVERSE, PART 2: THE PARALLEL UNIVERSE AND THE LOST MAZASSUMNIDA: GAME OF THE YEAR EDITION",
      source: "Contest > 구데기컵 > 제1회 구데기컵 🎮번",
      solves: 2,
    },
    {
      level: -1,
      categories: ["misc"],
      title: "훈민져ᇰᅙᅳᆷ나랏말ᄊᆞ미듀ᇰ귁에달아",
      source: "《訓民正音 諺解本》 序文",
      solves: -420420,
    },
  ];

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
  <ul class="problems">
    {#each problems as { level, categories, title, source, solves }}
      <li class="problem">
        <ProblemCard {level} {categories} {title} {source} {solves} />
      </li>
    {/each}
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
  header,
  .problems {
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
    transition: box-shadow 0.2s;
  }
  .search-bar:hover {
    box-shadow: 0 0.1rem 0.3rem 0 rgba(var(--text-color), calc(var(--background-opacity) * 3));
  }
  li > input {
    width: 6rem;
    border: none;
    border-radius: 1rem;
    padding: 0.5em;
    margin: 0 0.25em;
    text-align: center;
    color: rgb(var(--text-color));
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

  .problems {
    display: grid;
    /* https://css-tricks.com/preventing-a-grid-blowout/ */
    grid-template-columns: minmax(0, 1fr);
  }

  @media (min-width: 48em) {
    .problems {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (min-width: 64em) {
    .problems {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
</style>
