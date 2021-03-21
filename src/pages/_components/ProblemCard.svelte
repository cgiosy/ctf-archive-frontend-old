<script lang="ts">
  import LevelIcon from "./LevelIcon.svelte";

  export let level: number;
  export let categories: string[];
  export let title: string;
  export let source: string;
  export let solves: number;
</script>

<div class="problem">
  <LevelIcon {level} {categories} />
  <section>
    <h3 class="title">{title}</h3>
    <div class="info">
      <span class="source">{source}</span>
      <span class="solves">✓ {solves}</span>
    </div>
  </section>
</div>

<style>
  .problem {
    display: flex;
    align-items: center;
    padding: 1.5em 1em;
    margin: 0.5em;
    border-radius: 0.5em;
    border: 1px solid rgba(var(--text-color), calc(var(--background-opacity) * 2)); /* 2 vs 2.5 vs 3 */
    box-shadow: 0 0.1rem 0.3rem 0 rgba(var(--text-color), calc(var(--background-opacity) * 2));
    transition: border 0.25s, box-shadow 0.25s;
  }
  .problem:hover {
    border: 1px solid rgba(var(--text-color), calc(var(--background-opacity) * 4));
    box-shadow: 0 0.1rem 0.5rem 0 rgba(var(--text-color), calc(var(--background-opacity) * 8));
  }
  div {
    margin: 0.5em 0;
  }
  section {
    min-width: 0;
    width: 100%;
    margin-left: 1.25em;
  }
  .title {
    /* font-family: Montserrat; */
    margin: 0;
    /* text-shadow: 0 0.1em 0.3em rgba(var(--text-color), 0.2); */
  }
  .title,
  .source {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .info {
    display: flex;
    font-size: 0.95em;
    justify-content: space-between;
  }
  .source {
    margin-right: 1em;
  }
  .solves {
    /* font-family: "Spoqa Han Sans KR"; */
    margin-left: auto;
    flex-shrink: 0;
  }
</style>
