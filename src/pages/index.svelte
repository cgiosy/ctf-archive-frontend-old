<script lang="ts">
  import { useInfiniteQuery, useQueryClient } from "@sveltestack/svelte-query";
  import { goto, params } from "@roxi/routify";
  import { dequal } from "dequal/lite";
  import Logo from "./_components/Logo.svelte";
  import RadioBox from "./_components/RadioBox.svelte";
  import TextInput from "./_components/TextInput.svelte";
  import ProblemCard from "./_components/ProblemCard.svelte";
  import { get } from "../libs/fetcher";
  import { useVars } from "../libs/utils";
  import type { IProblem } from "../types";

  type GetUsersSortKey =
    | "solves_asc"
    | "solves_desc"
    | "level_desc"
    | "level_asc"
    | "id_desc"
    | "id_asc";
  type GetUsersQueryKey = ["problems", string, GetUsersSortKey];

  const toSort = (str: string) =>
    str === "solves_asc" ||
    str === "solves_desc" ||
    str === "level_desc" ||
    str === "level_asc" ||
    str === "id_desc" ||
    str === "id_asc"
      ? str
      : "solves_desc";

  const equal = (a: string, b: string) => a.split("_")[0] === b.split("_")[0];

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

  const getProblems = ({ pageParam }: any) =>
    get<{ count: number; problems: IProblem[] }>("/problems", {
      query,
      sort,
      page: String(Number(pageParam) || 1),
    });

  let scrollY = 0;
  let query: string = "";
  let sort: GetUsersSortKey = "solves_desc";
  let page = 1;
  const pageSize = 25;

  let count = -1;
  let queryKey: GetUsersQueryKey;
  let timeoutId: NodeJS.Timeout;
  const problems = useInfiniteQuery({
    queryFn: getProblems,
    enabled: false,
    // getNextPageParam: (lastGroup) => lastGroup.nextId || undefined,
    // staleTime: 1000 * 60 * 1
  });
  const queryClient = useQueryClient();

  const onQueryChanged = async (immediate: boolean = false) => {
    clearTimeout(timeoutId);
    if (queryKey !== undefined && !dequal(queryKey, ["problems", query, sort])) {
      timeoutId = setTimeout(
        () => {
          $goto("/", { query, sort });
        },
        immediate || queryKey.length <= 1 || queryKey[1] === query ? 0 : 500
      );
    }
  };
  const onParamsChanged = async () => {
    const newQueryKey: GetUsersQueryKey = [
      "problems",
      (query = typeof $params.query === "string" ? $params.query : ""),
      (sort = toSort($params.sort)),
      // (page = Math.max(Number($params.page), 1) || 1),
    ];
    if (queryKey !== undefined) await queryClient.cancelQueries(queryKey);
    queryKey = newQueryKey;
    problems.setOptions({ queryKey, queryFn: getProblems, staleTime: 1000 * 60 * 5 });
  };

  // $: count = $problems.data?.count ?? count;
  $: useVars(query, sort), onQueryChanged();
  $: useVars($params), onParamsChanged();
</script>

<svelte:window bind:scrollY />

<main>
  <header>
    <div class="search-logo">
      <Logo />
    </div>
    <div class="search">
      <div class="search-bar">
        <TextInput
          type="text"
          monospace={true}
          bind:value={query}
          large={true}
          onEnter={() => onQueryChanged(true)}>검색어</TextInput
        >
      </div>
      <div class="search-options">
        {#each [{ type: "solves", str: "푼 사람" }, { type: "level", str: "난이도" }, { type: "id", str: "최신 순" }] as { type, str }}
          <RadioBox
            bind:group={sort}
            value={sort !== `${type}_desc` ? `${type}_desc` : `${type}_asc`}
            {equal}>{str} {equal(sort, type) && sort === `${type}_asc` ? "↗" : "↘"}</RadioBox
          >
        {/each}
      </div>
    </div>
  </header>
  <ul class="problems">
    {#if $problems.status === "success"}
      {#each $problems.data.pages as page}
        {#each page.problems as problem}
          <li><ProblemCard {problem} /></li>
        {/each}
      {/each}
    {/if}
    {#if $problems.status !== "success" || $problems.isFetchingNextPage}
      {#each new Array(pageSize) as _}
        <li><ProblemCard /></li>
      {/each}
    {/if}
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
