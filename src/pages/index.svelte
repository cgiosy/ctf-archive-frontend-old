<script lang="ts">
  import { _ } from "svelte-i18n";
  import { useInfiniteQuery, useQueryClient } from "@sveltestack/svelte-query";
  import { goto, params } from "@roxi/routify";
  import { dequal } from "dequal/lite";
  import Logo from "./_components/Logo.svelte";
  import RadioBox from "./_components/RadioBox.svelte";
  import TextInput from "./_components/TextInput.svelte";
  import ColorList from "./_components/ColorList.svelte";
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

  const queryClient = useQueryClient();

  let scrollY = 0;
  let innerHeight = 0;
  let clientHeight = 0;
  let isPending = false;
  let query: string = "";
  let sort: GetUsersSortKey = "solves_desc";
  const pageSize = 25;

  let count = -1;
  let queryKey: GetUsersQueryKey;
  let timeoutId: NodeJS.Timeout;

  const getProblems = ({ pageParam }: any) =>
    get<{ count: number; problems: IProblem[] }>("/problems", {
      query: query
        .split(/\s+/)
        .map((s) => `%${s}%`)
        .join("\n"),
      sort,
      page: String(Number(pageParam) || 1),
    });

  const problems = useInfiniteQuery({
    queryFn: getProblems,
    enabled: false,
  });

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
      // (page = Math.max(Number($params.page) || 1, 1)),
    ];
    if (queryKey !== undefined) await queryClient.cancelQueries(queryKey);
    queryKey = newQueryKey;
    problems.setOptions({
      queryKey,
      queryFn: getProblems,
      getNextPageParam: (lastGroup, pages) =>
        lastGroup.count > (pages.length - 1) * pageSize + pages[pages.length - 1].problems.length
          ? pages.length + 1
          : undefined,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });
  };

  // $: count = $problems.data?.count ?? count;
  $: useVars(query, sort), onQueryChanged();
  $: useVars($params), onParamsChanged();
  $: {
    if (
      !isPending &&
      !$problems.isFetching &&
      $problems.hasNextPage &&
      scrollY >= clientHeight - innerHeight - 48 * 6
    ) {
      isPending = true;
      $problems.fetchNextPage().then(() => {
        isPending = false;
      });
    }
  }
</script>

<svelte:window bind:scrollY bind:innerHeight />

<main bind:clientHeight>
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
          onEnter={() => onQueryChanged(true)}>{$_("problem.searchQuery")}</TextInput
        >
      </div>
      <ColorList />
      <div class="search-options">
        {#each ["solves", "level", "id"] as type}
          <RadioBox
            bind:group={sort}
            value={sort !== `${type}_desc` ? `${type}_desc` : `${type}_asc`}
            {equal}
            >{$_(`problem.${type}`)}
            {equal(sort, type) && sort === `${type}_asc` ? "↗" : "↘"}</RadioBox
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
    padding: 1rem;
  }
  ul {
    list-style-type: none;
    margin: 0;
  }
  .search {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .search-bar {
    width: 100%;
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
