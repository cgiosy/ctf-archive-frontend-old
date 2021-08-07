<script lang="ts">
  import { useQuery } from "@sveltestack/svelte-query";
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

  const users = useQuery(["users", query, sort, page], getUsers);
  let count = 0;

  $: users.setOptions({ queryKey: ["users", query, sort, page], queryFn: getUsers });
  $: count = $users.data?.count || count;
</script>

<main>
  <header>
    <div class="search-logo">
      <Logo />
    </div>
    <TextInput type="text" bind:value={query} monospace={true}>검색어</TextInput>
    <RadioBox bind:group={sort} value="exp_desc">경험치 ↘</RadioBox>
    <RadioBox bind:group={sort} value="exp_asc">경험치 ↗</RadioBox>
    <RadioBox bind:group={sort} value="solves_desc">문제 수 ↘</RadioBox>
    <RadioBox bind:group={sort} value="solves_asc">문제 수 ↗</RadioBox>
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
      {#each new Array(count ? Math.max(count - (page - 1) * pageSize, 0) : pageSize) as _, index}
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
</style>
