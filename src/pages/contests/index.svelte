<script lang="ts">
  import InfiniteLoading from "svelte-infinite-loading";
  import Logo from "../_components/Logo.svelte";
  import ContestCard from "../_components/ContestCard.svelte";
  import { randomInt, randomContests, delay } from "../../libs";
  import type { InfiniteEvent } from "svelte-infinite-loading";
  import type { IContest } from "../../types";

  const pageSize = 25;

  const getContests = (page: number) =>
    delay({
      count: randomInt(10) > 0 ? Infinity : 0,
      contests: randomContests(25),
    });

  let resultContests: (IContest | undefined)[] = [];
  let page = 0;

  const infiniteHandler = ({ detail: { loaded, complete } }: InfiniteEvent) => {
    const request = getContests(++page);
    const prevResultContests = [...resultContests];
    resultContests = [...prevResultContests, ...new Array(pageSize)];
    request.then(({ count, contests }) => {
      resultContests = [...prevResultContests, ...contests];
      if (resultContests.length >= count) {
        complete();
      }
      loaded();
    });
  };

  let query = "";
</script>

<main>
  <header>
    <div class="search-logo">
      <Logo />
    </div>
    <input type="text" class="search-bar" bind:value={query} placeholder="대회 검색" />
  </header>
  <ul class="contests">
    {#each resultContests as contest}
      <li><ContestCard {contest} /></li>
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
  .contests {
    width: 100%;
    max-width: var(--content-max-width);
    padding: 2rem 1rem;
  }
  ul {
    list-style-type: none;
  }
  .search-bar {
    display: flex;
    width: 100%;
    padding: 1.5rem 2rem;
    border: 1px solid rgba(var(--text-color), calc(var(--background-opacity) * 5));
    border-radius: 0.5rem;
    color: rgb(var(--text-color));
    font-size: 1.25em;
    transition: box-shadow 0.15s;
  }
  .search-bar:hover {
    box-shadow: 0 0.0625rem 0.375rem 0 rgba(var(--text-color), calc(var(--background-opacity) * 3));
  }
  .search-bar:focus {
    outline: none;
  }
  .search-logo {
    font-size: 3rem;
    margin-bottom: 2rem;
  }

  .contests {
    display: grid;
    /* == https://css-tricks.com/preventing-a-grid-blowout == */
    grid-template-columns: minmax(0, 1fr);
  }
</style>
