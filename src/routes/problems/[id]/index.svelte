<script type="ts">
  import Main from "./main.svelte";
  import Writeup from "./writeup.svelte";
  import Tabs from "../../_components/Tabs.svelte";

  let items = [
    {
      label: "Main",
      value: 1,
      component: Main,
    },
    {
      label: "Writeup",
      value: 2,
      component: Writeup,
    },
  ];
</script>

<main>
  <div>
    <Tabs {items} />
  </div>
</main>

<style>
  main {
    display: flex;
    align-items: center;
    padding: 1rem 1rem;
    justify-content: center;
  }
</style>
