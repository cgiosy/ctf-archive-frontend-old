<script lang="ts">
  import { _ } from "svelte-i18n";
  import { MetaTags } from "svelte-meta-tags";
  import { goto, params } from "@roxi/routify";
  import { useQueryClient } from "@sveltestack/svelte-query";
  import { dequal } from "dequal/lite";
  import Logo from "../_components/Logo.svelte";
  import ColorList from "../_components/ColorList.svelte";
  import UserLink from "../_components/UserLink.svelte";
  import RadioBox from "../_components/RadioBox.svelte";
  import TextInput from "../_components/TextInput.svelte";
  import { useVars, expsSum, style } from "../../libs/utils";
  import { useUsers } from "../../queries";

  type GetUsersSortKey = "exp_desc" | "exp_asc" | "solves_asc" | "solves_desc";

  const toSort = (str: string) =>
    str === "exp_desc" || str === "exp_asc" || str === "solves_asc" || str === "solves_desc"
      ? str
      : "exp_desc";

  const equal = (a: string, b: string) => a.split("_")[0] === b.split("_")[0];

  let query: string;
  let sort: GetUsersSortKey;
  let page: number;
  const pageSize = 50;

  let total = -1;
  let timeoutId: NodeJS.Timeout;
  const [users, getUsers, usersKey] = useUsers();
  const queryClient = useQueryClient();

  const onQueryChanged = async (immediate: boolean = false) => {
    clearTimeout(timeoutId);
    const queryKey = usersKey();
    if (queryKey !== undefined && !dequal(queryKey, ["user", query, sort, page])) {
      timeoutId = setTimeout(
        () => {
          $goto(".", { query, sort, page: page.toString() });
        },
        immediate || queryKey.length <= 1 || queryKey[1] === query ? 0 : 500
      );
    }
  };
  const onParamsChanged = async () => {
    const queryKey = usersKey();
    if (queryKey !== undefined) await queryClient.cancelQueries(queryKey);
    query = typeof $params.query === "string" ? $params.query : "";
    sort = toSort($params.sort);
    page = Math.max(Number($params.page), 1) || 1;
    getUsers(query, sort, page);
  };

  $: total = $users.data?.total ?? total;
  $: useVars(query, sort, page), onQueryChanged();
  $: useVars($params), onParamsChanged();
</script>

<MetaTags
  title="{$_('ranking.ranking')} | CTF Archive"
  openGraph={{
    type: "website",
    site_name: "CTF Archive",
    url: location.toString(),
    title: `${$_("ranking.ranking")} | CTF Archive`,
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
          on:enter={() => onQueryChanged(true)}>{$_("ranking.searchQuery")}</TextInput
        >
      </div>
      <div class="search-options">
        {#each ["exp", "solves"] as type}
          <RadioBox
            bind:group={sort}
            value={sort !== `${type}_desc` ? `${type}_desc` : `${type}_asc`}
            {equal}
            >{$_(`user.${type}`)}
            {equal(sort, type) && sort === `${type}_asc` ? "↗" : "↘"}</RadioBox
          >
        {/each}
      </div>
    </div>
    <ColorList
      style={style({
        "margin-top": "1.5em",
        "margin-bottom": 0,
        float: "right",
      })}
    />
  </header>
  <table>
    <tr>
      <th>{$_("user.ranking")}</th>
      <th>{$_("user.id")}</th>
      <th>{$_("user.description")}</th>
      <th>{$_("user.exp")}</th>
      <th>{$_("user.solves")}</th>
    </tr>
    {#if $users.isSuccess}
      {#each $users.data.users as user, index (user.username)}
        <tr>
          <td>#{(page - 1) * pageSize + index + 1}</td>
          <td><UserLink {user} /></td>
          <td class="description">{user.description}</td>
          <td>{new Intl.NumberFormat().format(expsSum(user.exps))}</td>
          <td>{new Intl.NumberFormat().format(user.solves)}</td>
        </tr>
      {/each}
    {:else}
      {#each new Array(total >= 0 ? Math.max(total - (page - 1) * pageSize, 0) : pageSize) as _, index}
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
    display: flex;
    font-size: 3rem;
    margin-bottom: 2rem;
    justify-content: center;
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
