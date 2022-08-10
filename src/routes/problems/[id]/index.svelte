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

<Tabs {items} />
