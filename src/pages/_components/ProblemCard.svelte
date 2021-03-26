<script lang="ts">
  import LevelIcon from "./LevelIcon.svelte";
  import type { IProblem } from "../../types";

  export let problem: IProblem | undefined = undefined;
</script>

{#if problem}
  <a href={`/problem/${problem.id}`} class="problem">
    <LevelIcon level={problem.level} categories={problem.categories} />
    <section>
      <h3 class="title">{problem.title}</h3>
      <div class="info">
        <a href={`/?q=${encodeURIComponent(problem.source)}`} class="source">{problem.source}</a>
        <span class="solves"><b>✓</b> {problem.solves}</span>
      </div>
    </section>
  </a>
{:else}
  <span class="problem" style="pointer-events: none">
    <LevelIcon level="" />
    <section>
      <h3 class="title">&nbsp;</h3>
      <div class="info">&nbsp;</div>
    </section>
  </span>
{/if}

<style>
  .problem {
    display: flex;
    align-items: center;
    contain: content;
    padding: 1.5em 1em;
    margin: 0.5em;
    border-radius: 0.5em;
    /* 2 vs 2.5 vs 3 */
    border: 0.0625em solid rgba(var(--text-color), calc(var(--background-opacity) * 2));
    box-shadow: 0 0.0625em 0.375em 0 rgba(var(--text-color), calc(var(--background-opacity) * 2));
    transition: border 0.175s, box-shadow 0.175s, transform 0.175s;
  }
  .problem:hover {
    border: 0.0625em solid rgba(var(--text-color), calc(var(--background-opacity) * 4));
    box-shadow: 0 0.125em 0.5em 0 rgba(var(--text-color), calc(var(--background-opacity) * 8));
    transform: scale(1.025);
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
  }
  .title,
  .source {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .info {
    display: flex;
    font-size: 0.9375em;
    /* font-size: 0.875em; */
    justify-content: space-between;
  }
  .source {
    margin-right: 1em;
  }
  .source:hover {
    text-decoration: underline;
  }
  .solves {
    /* font-family: "Spoqa Han Sans KR"; */
    margin-left: auto;
    flex-shrink: 0;
  }
</style>
