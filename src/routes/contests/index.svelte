<script lang="ts">
  import Logo from "../_components/Logo.svelte";
  import TextInput from "../_components/TextInput.svelte";
  import ContestCard from "../_components/ContestCard.svelte";
  import { randomInt, randomContests } from "../../libs/random";
  import { delay } from "../../libs/utils";
  import type { IContest } from "../../types";

  const pageSize = 25;

  const getContests = (page: number) =>
    delay({
      count: randomInt(10) > 0 ? Infinity : 0,
      contests: randomContests(25),
    });

  let resultContests: (IContest | undefined)[] = [];
  let page = 0;

  const infiniteHandler = ({ detail: { loaded, complete } }: any) => {
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
    <TextInput type="text" bind:value={query} monospace={true} size={1.5}>대회 검색</TextInput>
  </header>
  <ul class="contests">
    {#each resultContests as contest (contest?.id)}
      <li><ContestCard {contest} /></li>
    {/each}

    <!-- <InfiniteLoading on:infinite={infiniteHandler}>
      <slot name="noMore" />
    </InfiniteLoading> -->
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
  .contests {
    width: 100%;
    max-width: var(--content-max-width);
    padding: 2rem 1rem;
  }
  ul {
    list-style-type: none;
  }
  .search-logo {
    display: flex;
    font-size: 3rem;
    margin-bottom: 2rem;
    justify-content: center;
  }

  .contests {
    display: grid;
    /* == https://css-tricks.com/preventing-a-grid-blowout == */
    grid-template-columns: minmax(0, 1fr);
  }
</style>
