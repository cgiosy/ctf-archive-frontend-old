<script lang="ts">
  import InfiniteLoading from "svelte-infinite-loading";
  import Logo from "./_components/Logo.svelte";
  import TextInput from "./_components/TextInput.svelte";
  import ProblemCard from "./_components/ProblemCard.svelte";
  import { randomInt, randomProblems, delay } from "../libs/utils";
  import type { InfiniteEvent } from "svelte-infinite-loading";
  import type { IProblem } from "../types";

  const pageSize = 25;

  // Tag Functions
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

  let queries: string = "";
  let resultProblems: (IProblem | undefined)[] = [];
  let page = 0;

  const infiniteHandler = ({ detail: { loaded, complete } }: InfiniteEvent) => {
    const request = getProblems(queries, ++page);
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
</script>

<main>
  <header>
    <div class="search-logo">
      <Logo />
    </div>
    <TextInput type="text" bind:value={queries} monospace={true} large={true}>검색어</TextInput>
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
  .search-logo {
    font-size: 3rem;
    margin-bottom: 2rem;
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
