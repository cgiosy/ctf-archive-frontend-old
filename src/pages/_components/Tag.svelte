<script lang="ts">
  import { tidToTag } from "../../constants/tags";

  export let tid: number;
  let tag: string;

  $: tag = (tidToTag[tid] ?? [""])[0];
</script>

<a href="/?query={tag}">{tag}</a>

<style>
  a {
    display: inline-block;
    margin: 0.125em 0.25em;
    font-family: var(--font-family-monospace);
  }
  a:hover {
    text-decoration: underline;
  }
</style>
