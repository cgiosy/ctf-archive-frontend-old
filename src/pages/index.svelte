<script lang="ts">
  import InfiniteLoading from "svelte-infinite-loading";
  import Logo from "./_components/Logo.svelte";
  import ProblemCard from "./_components/ProblemCard.svelte";
  import { randomInt, randomProblems, delay } from "../libs";
  import type { InfiniteEvent } from "svelte-infinite-loading";
  import type { IProblem } from "../types";

  const pageSize = 25;

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

  const getProblems = (queryString: string, page: number) =>
    delay({
      count: randomInt(10) > 0 ? Infinity : 0,
      problems: randomProblems(25),
    });

  let queries: string[] = ["web", "d5", "ssti"];
  let lastQuery: string = "";
  let resultProblems: (IProblem | undefined)[] = [];
  let page = 0;

  const infiniteHandler = ({ detail: { loaded, complete } }: InfiniteEvent) => {
    const request = getProblems(queries.join(" "), ++page);
    const prevResultProblems = [...resultProblems];
    resultProblems = [...prevResultProblems, ...new Array(pageSize)];
    request.then(({ count, problems }) => {
      resultProblems = [...prevResultProblems, ...problems];
      if (resultProblems.length >= count) {
        complete();
      }
      loaded();
    });
  };

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
    {#each resultProblems as problem}
      <li><ProblemCard {problem} /></li>
    {/each}

    <InfiniteLoading on:infinite={infiniteHandler}>
      <slot name="noMore" />
    </InfiniteLoading>
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
  ul {
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
    transition: box-shadow 0.15s;
  }
  .search-bar:hover {
    box-shadow: 0 0.0625rem 0.375rem 0 rgba(var(--text-color), calc(var(--background-opacity) * 3));
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
    /* == https://css-tricks.com/preventing-a-grid-blowout == */
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
