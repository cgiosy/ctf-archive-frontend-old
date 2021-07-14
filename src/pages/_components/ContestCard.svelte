<script lang="ts">
  import LevelIcon from "./LevelIcon.svelte";
  import type { IContest } from "../../types";

  export let contest: IContest | undefined = undefined;

  const defaultProblemCount: number = 10;

  function scrollHorizontally(e: WheelEvent) {
    // TODO: smooth scroll
    if (e.currentTarget) (e.currentTarget as Element).scrollLeft += e.deltaY;
  }
  // url={`/problem/${id}`}
</script>

{#if contest}
  <a href={`/contest/${contest.id}`} class="contest">
    <section>
      <h3 class="title" style="/* background-image: src('/assets/images/contest/{contest.id}') */">
        {contest.title}
      </h3>
      <ul on:wheel|preventDefault={scrollHorizontally}>
        {#each contest.problems as { id, levels }}
          <li><LevelIcon {levels} /></li>
        {/each}
      </ul>
    </section>
  </a>
{:else}
  <span class="contest" style="pointer-events: none">
    <section>
      <h3 class="title">&nbsp;</h3>
      <ul>
        {#each [...new Array(defaultProblemCount)] as problem}
          <li><LevelIcon /></li>
        {/each}
      </ul>
    </section>
  </span>
{/if}

<style>
  .contest {
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
  .contest:hover {
    border: 0.0625em solid rgba(var(--text-color), calc(var(--background-opacity) * 4));
    box-shadow: 0 0.125em 0.75em 0 rgba(var(--text-color), calc(var(--background-opacity) * 4));
    transform: scale(1.025);
  }
  ul {
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
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  ul {
    display: flex;
    list-style-type: none;
    margin: 1em 0 0 -1em;
    padding: 0;
    font-size: 0.9375em;
    /* font-size: 0.875em; */
    overflow-x: scroll;
  }
  li {
    line-height: 0;
    margin-right: 0.25em;
  }

  @media (hover: hover) and (pointer: fine) {
    ul {
      overflow-x: hidden;
    }
  }
</style>
