<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { tidToTag } from "../../constants/tags";

  const dispatch = createEventDispatcher();
  export let tid: number;

  const onClick = (e: MouseEvent) => {
    e.stopPropagation();
    dispatch("click", tid);
  };
</script>

<span on:click={onClick}>{tidToTag[tid][0] ?? ""}</span>

<style>
  span {
    display: inline-block;
    min-width: 6em;
    width: var(--width);
    margin: 0.25em 0.25em;
    padding: 0.375em 1.5em;
    font-family: var(--font-family-monospace);
    background: rgba(var(--text-color), calc(var(--background-opacity) * 2.5));
    border: none;
    border-radius: 1.5em;
    text-align: center;
    transition: background 0.175s;
    cursor: pointer;
  }
  span:hover {
    background: rgba(var(--text-color), calc(var(--background-opacity) * 4));
  }
</style>
