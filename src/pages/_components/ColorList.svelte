<script lang="ts">
  import { categoryColors } from "../../libs/utils";
  import { ProblemCategory } from "../../types";

  export let colors: { code: string; text: string }[] = [
    { code: categoryColors[ProblemCategory.Pwnable], text: "Pwnable" },
    { code: categoryColors[ProblemCategory.Reversing], text: "Reversing" },
    { code: categoryColors[ProblemCategory.Crypto], text: "Crypto" },
    { code: categoryColors[ProblemCategory.Web], text: "Web" },
    { code: categoryColors[ProblemCategory.Forensic], text: "Forensic" },
    { code: categoryColors[ProblemCategory.Misc], text: "Misc" },
  ];
</script>

<ul>
  {#each colors as color}
    <li><i style="background: {color.code}" /> {color.text}</li>
  {/each}
</ul>

<style>
  ul {
    display: block;
    list-style-type: none;
    /* margin: 1em 0 0 -1em; */
    margin: 1em;
    margin-bottom: 2em;
    padding: 0;
    font-size: 0.9375em;
    /* font-size: 0.875em; */
  }
  li {
    display: inline-block;
    padding: 0.5em 1em;
    line-height: 0;
    margin-right: 0.25em;
  }
  i {
    display: inline-block;
    width: 1em;
    height: 1em;
    border-radius: 50%;
    margin-right: 0.375em;
  }
</style>
