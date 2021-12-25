<script lang="ts">
  import { _ } from "svelte-i18n";
  import { MetaTags } from "svelte-meta-tags";
  import { useInfiniteQuery, useQueryClient } from "@sveltestack/svelte-query";
  import { goto, params } from "@roxi/routify";
  import { dequal } from "dequal/lite";
  import Logo from "./_components/Logo.svelte";
  import RadioBox from "./_components/RadioBox.svelte";
  import Search from "./_components/Search.svelte";
  import ColorList from "./_components/ColorList.svelte";
  import ProblemCard from "./_components/ProblemCard.svelte";
  import { get } from "../libs/fetcher";
  import { parseSearchQuery, queryToString, useVars } from "../libs/utils";
  import { tagToTid } from "../constants/tags";
  import { SearchType } from "../types";
  import type { IProblem, ISearchQuery } from "../types";

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

  const queryClient = useQueryClient();

  let scrollY = 0;
  let innerHeight = 0;
  let clientHeight = 0;
  let isPending = false;
  let query: string = "";
  let queries: ISearchQuery[] = [];
  let sort: GetUsersSortKey = "solves_desc";
  const solvedSet: Set<number> = new Set();
  const pageSize = 25;

  let count = -1;
  let queryKey: GetUsersQueryKey;
  let timeoutId: NodeJS.Timeout;

  const getProblems = ({ pageParam }: any) => {
    const realQueries: { types: number; query: string | number }[] = [];
    for (let { not, types, value } of queries) {
      value = parseSearchQuery(value).value; // TODO: Fix
      if (types === SearchType.Level || types === SearchType.Solves) {
        const [l, r] = value.split(/[\.,]+/);
        if (!not && l !== "") realQueries.push({ types: ~types, query: l }); // >=l
        if (!not && r !== "") realQueries.push({ types, query: r }); // <=r
        if (not && l !== "") realQueries.push({ types, query: (Number(l) - 1).toString() }); // <=l-1
        if (not && r !== "") realQueries.push({ types: ~types, query: (Number(r) + 1).toString() }); // r+1>=
      } else if (types === SearchType.Tag) {
        realQueries.push({ types: not ? ~types : types, query: tagToTid[value].toString() });
      } else {
        realQueries.push({ types: not ? ~types : types, query: value });
      }
    }
    return get<{ total: number; solves: number; problems: IProblem[]; solved: number[] }>(
      "/problems",
      {
        queries: JSON.stringify(realQueries),
        sort,
        page: String(Number(pageParam) || 1),
      }
    );
  };

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
    queries = query
      .split("\n")
      .filter((str) => str.length > 0)
      .map(parseSearchQuery);
    if (queryKey !== undefined) await queryClient.cancelQueries(queryKey);
    queryKey = newQueryKey;
    problems.setOptions({
      queryKey,
      queryFn: getProblems,
      getNextPageParam: (lastGroup, pages) =>
        lastGroup.total > (pages.length - 1) * pageSize + pages[pages.length - 1].problems.length
          ? pages.length + 1
          : undefined,
      onSuccess: (data) => {
        if (data !== undefined)
          data.pages.forEach(({ solved }) => solved.forEach((id) => solvedSet.add(id)));
      },
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });
  };

  // $: total = $problems.data?.total ?? total;
  $: query = queries.map(queryToString).join("\n");
  $: useVars(query, sort), onQueryChanged(true);
  $: useVars($params), onParamsChanged();
  $: {
    if (
      !isPending &&
      !$problems.isFetching &&
      $problems.hasNextPage &&
      scrollY >= clientHeight - innerHeight - 48 * 6
    ) {
      isPending = true;
      $problems.fetchNextPage().then((data) => {
        isPending = false;
      });
    }
  }
</script>

<MetaTags
  title="CTF Archive"
  openGraph={{
    type: "website",
    site_name: "CTF Archive",
    url: location.toString(),
    title: "CTF Archive",
    images: [
      {
        url: "https://ctf-archive.com/assets/images/logo-800.png",
        alt: "CTF Archive Logo",
        width: 800,
        height: 800,
      },
    ],
  }}
/>

<svelte:window bind:scrollY bind:innerHeight />

<main bind:clientHeight>
  <header>
    <div class="search-logo">
      <Logo />
    </div>
    <div class="search">
      <div class="search-bar">
        <Search bind:queries on:submit={() => onQueryChanged(true)} />
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
      {#if $problems.status === "success"}
        <div class="problems-count">
          {new Intl.NumberFormat().format($problems.data.pages[0].total)}개를 찾았어요. ({new Intl.NumberFormat().format(
            $problems.data.pages[0].solves
          )}개 풀었어요!)
        </div>
      {/if}
    </div>
  </header>
  <ul class="problems">
    {#if $problems.status === "success"}
      {#each $problems.data.pages as page}
        {#each page.problems as problem (problem.id)}
          <li><ProblemCard {problem} solved={solvedSet.has(problem.id)} /></li>
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
  ul {
    contain: content;
  }
  header,
  .problems {
    width: 100%;
    max-width: var(--content-max-width);
    padding: 2rem 1rem 0 1rem;
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
    /* font-size: 0.9325em; */
  }
  .search-logo {
    display: flex;
    font-size: 3rem;
    margin-bottom: 2rem;
    justify-content: center;
  }

  .problems {
    display: grid;
    /* == https://css-tricks.com/preventing-a-grid-blowout == */
    grid-template-columns: minmax(0, 1fr);
  }
  .problems-count {
    font-size: 0.8em;
    margin: 0.5em 1em;
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
