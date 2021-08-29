<script lang="ts">
  import { goto, params } from "@roxi/routify";
  import { useQuery, useQueryClient } from "@sveltestack/svelte-query";
  import { dequal } from "dequal/lite";
  import Logo from "../_components/Logo.svelte";
  import UserLink from "../_components/UserLink.svelte";
  import RadioBox from "../_components/RadioBox.svelte";
  import TextInput from "../_components/TextInput.svelte";
  import { useVars, expsSum } from "../../libs/utils";
  import { get } from "../../libs/fetcher";
  import type { IUserMiniInfo } from "../../types";

  type GetUsersSortKey = "exp_desc" | "exp_asc" | "solves_asc" | "solves_desc";
  type GetUsersQueryKey = ["users", string, GetUsersSortKey, number];

  const toSort = (str: string) =>
    str === "exp_desc" || str === "exp_asc" || str === "solves_asc" || str === "solves_desc"
      ? str
      : "exp_desc";

  const equal = (a: string, b: string) => a.split("_")[0] === b.split("_")[0];

  let query: string;
  let sort: GetUsersSortKey;
  let page: number;
  const pageSize = 50;
  const getUsers = () =>
    get<{
      count: number;
      users: IUserMiniInfo[];
    }>("/users", {
      query,
      sort,
      page: page.toString(),
    });

  let count = -1;
  let queryKey: GetUsersQueryKey;
  let timeoutId: NodeJS.Timeout;
  const usersQuery = useQuery({ queryFn: getUsers, enabled: false });
  const queryClient = useQueryClient();

  const onQueryChanged = async (immediate: boolean = false) => {
    clearTimeout(timeoutId);
    if (queryKey !== undefined && !dequal(queryKey, ["users", query, sort, page])) {
      timeoutId = setTimeout(
        () => {
          $goto(undefined, { query, sort, page });
        },
        immediate || queryKey.length <= 1 || queryKey[1] === query ? 0 : 500
      );
    }
  };
  const onParamsChanged = async () => {
    const newQueryKey: GetUsersQueryKey = [
      "users",
      (query = typeof $params.query === "string" ? $params.query : ""),
      (sort = toSort($params.sort)),
      (page = Math.max(Number($params.page), 1) || 1),
    ];
    if (queryKey !== undefined) await queryClient.cancelQueries(queryKey);
    queryKey = newQueryKey;
    usersQuery.setOptions({ queryKey, queryFn: getUsers });
  };

  $: count = $usersQuery.data?.count ?? count;
  $: useVars(query, sort, page), onQueryChanged();
  $: useVars($params), onParamsChanged();
</script>

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
          onEnter={() => onQueryChanged(true)}>검색어</TextInput
        >
      </div>
      <div class="search-options">
        {#each [{ type: "exp", str: "경험치" }, { type: "solves", str: "문제 수" }] as { type, str }}
          <RadioBox
            bind:group={sort}
            value={sort !== `${type}_desc` ? `${type}_desc` : `${type}_asc`}
            {equal}>{str} {equal(sort, type) && sort === `${type}_asc` ? "↗" : "↘"}</RadioBox
          >
        {/each}
      </div>
    </div>
  </header>
  <table>
    <tr>
      <th>순위</th>
      <th>핸들</th>
      <th>설명</th>
      <th>경험치</th>
      <th>문제 수</th>
    </tr>
    {#if $usersQuery.isSuccess}
      {#each $usersQuery.data.users as user, index}
        <tr>
          <td>#{(page - 1) * pageSize + index + 1}</td>
          <td><UserLink {user} /></td>
          <td class="description">{user.description}</td>
          <td>{new Intl.NumberFormat().format(expsSum(user.exps))}</td>
          <td>{new Intl.NumberFormat().format(user.solves)}</td>
        </tr>
      {/each}
    {:else}
      {#each new Array(count >= 0 ? Math.max(count - (page - 1) * pageSize, 0) : pageSize) as _, index}
        <tr>
          <td>#{(page - 1) * pageSize + index + 1}</td>
          <td />
          <td />
          <td />
        </tr>
      {/each}
    {/if}
  </table>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  main,
  header,
  table {
    contain: content;
  }
  header,
  table {
    width: 100%;
    max-width: var(--content-max-width);
    padding: 2rem 1rem;
    border-collapse: collapse;
  }
  .search-logo {
    font-size: 3rem;
    margin-bottom: 2rem;
  }
  .search {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .search-bar {
    width: 100%;
    display: inline-flex;
  }
  .search-options {
    display: inline-flex;
    margin-left: auto;
  }
  tr {
    height: 4.25em;
    border-bottom: 1px solid #e0e0e0;
  }
  th {
    text-align: left;
  }
  th,
  td {
    font-family: Montserrat;
    padding: 0.75em;
  }
  .description {
    font-family: inherit;
  }

  @media (min-width: 64em) {
    .search {
      flex-direction: row;
    }
    .search-bar {
      max-width: 16em;
    }
  }
</style>
