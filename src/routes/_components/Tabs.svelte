<script lang="ts">
  import { _ } from "svelte-i18n";

  type TabType = {
    label: string;
    value: number;
    component: any;
  };
  export let items: TabType[] = [];
  export let activeTabValue = 1;

  const handleClick = (tabValue: number) => () => (activeTabValue = tabValue);
</script>

<ul>
  {#each items as item}
    <li class={activeTabValue === item.value ? "active" : ""}>
      <span on:click={handleClick(item.value)}>{item.label}</span>
    </li>
  {/each}
</ul>
{#each items as item}
  {#if activeTabValue == item.value}
    <div class="box">
      <svelte:component this={item.component} />
    </div>
  {/if}
{/each}

<style>
  .box {
    align-items: center;
    display: flex;
    justify-content: center;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    padding-left: 0;
    margin-bottom: 0;
    list-style: none;
    border-bottom: 3px solid rgba(var(--text-color), calc(var(--background-opacity) * 3));
  }
  li {
    margin-bottom: -1px;
  }

  span {
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    display: block;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }

  span:hover {
    border-color: #e9ecef #e9ecef #dee2e6;
  }

  li.active > span {
    color: #495057;
    background-color: #fff;
    border-color: #dee2e6 #dee2e6 #fff;
  }
</style>
