<script lang="ts">
  import { useQuery, useQueryClient } from "@sveltestack/svelte-query";
  import Logo from "../_components/Logo.svelte";
  import TextInput from "../_components/TextInput.svelte";
  import { expsSum } from "../../libs/utils";
  import { get } from "../../libs/fetcher";
  import type { IUserMiniInfo } from "../../types";
  import ExpIcon from "../_components/ExpIcon.svelte";
  import RadioBox from "../_components/RadioBox.svelte";

  let query = "";
  let sort: "exp_desc" | "exp_asc" | "solves_asc" | "solves_desc" = "exp_desc";
  const page = 1;
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

  let version = 0;
  let count = -1;
  let queryKey = ["users", query, sort, page];
  const queryClient = useQueryClient();
  const users = useQuery({ queryKey, queryFn: getUsers });

  $: count = $users.data?.count ?? count;
  $: {
    version += 1;
    if (version > 1) {
      const prevVersion = version;
      setTimeout(() => {
        if (prevVersion === version)
          queryClient.cancelQueries(queryKey).then(() => {
            users.setOptions({ queryKey, queryFn: getUsers });
          });
      }, 500);
    }
    queryKey = ["users", query, sort, page];
  }
</script>

<main>
  <header>
    <div class="search-logo">
      <Logo />
    </div>
    <div class="search">
      <div class="search-bar">
        <TextInput type="text" bind:value={query} monospace={true}>검색어</TextInput>
      </div>
      <div class="search-options">
        <RadioBox bind:group={sort} value="exp_desc">경험치 ↘</RadioBox>
        <RadioBox bind:group={sort} value="exp_asc">경험치 ↗</RadioBox>
        <RadioBox bind:group={sort} value="solves_desc">문제 수 ↘</RadioBox>
        <RadioBox bind:group={sort} value="solves_asc">문제 수 ↗</RadioBox>
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
    {#if $users.isSuccess}
      {#each $users.data.users as user, index}
        <tr>
          <td>#{(page - 1) * pageSize + index + 1}</td>
          <td
            ><ExpIcon url={"/profile/" + user.username} exps={user.exps} small={true} />
            {user.username}</td
          >
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
