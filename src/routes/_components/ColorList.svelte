<script lang="ts">
  import SideFading from "./SideFading.svelte";
  import { style as styleUtil, categoryColors } from "../../libs/utils";
  import { ProblemCategory } from "../../types";

  export let colors: { code: string; text: string }[] = [
    { code: categoryColors[ProblemCategory.Pwnable], text: "Pwnable" },
    { code: categoryColors[ProblemCategory.Reversing], text: "Reversing" },
    { code: categoryColors[ProblemCategory.Crypto], text: "Crypto" },
    { code: categoryColors[ProblemCategory.Web], text: "Web" },
    { code: categoryColors[ProblemCategory.Forensic], text: "Forensic" },
    { code: categoryColors[ProblemCategory.Misc], text: "Misc" },
  ];
  export let style: string | undefined = undefined;
</script>

<SideFading>
  <ul {style}>
    {#each colors as color}
      <li><i style={styleUtil({ background: color.code })} /> {color.text}</li>
    {/each}
  </ul>
</SideFading>

<style>
  ul {
    list-style-type: none;
    white-space: nowrap;
    width: 100%;
    height: 100%;
    padding: 0 0.5em;
    margin: 0;
    font-size: 0.9375em;
    /* font-size: 0.875em; */
    overflow: auto hidden;
  }
  li {
    display: inline-block;
    padding: calc(0.5em + 6px) 0.825em;
    line-height: 0;
    margin: 0;
  }
  i {
    display: inline-block;
    width: 1em;
    height: 1em;
    border-radius: 50%;
    margin-right: 0.375em;
  }
</style>
