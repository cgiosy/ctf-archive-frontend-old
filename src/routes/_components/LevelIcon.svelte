<script lang="ts">
  import { categoryColors, levelsToLevel } from "../../libs/utils";
  import type { Levels, ProblemCategory } from "../../types";

  export let url: string | undefined = undefined;
  export let levels: Levels = [-Infinity, -Infinity, -Infinity, -Infinity, -Infinity, -Infinity];
  export let solved: boolean = false;
  export let small: boolean = false;

  let levelSum: number;
  let categories: { sum: number; level: number; category: ProblemCategory }[];
  let style: string;

  $: {
    categories = levels
      .map((level, category: ProblemCategory) => ({
        category,
        level,
        sum: 0,
      }))
      .filter(({ level }) => level > 0);

    categories.sort(({ level: level1 }, { level: level2 }) => level2 - level1);

    levelSum = 0;
    categories.forEach((val) => {
      val.sum = levelSum += val.level;
    });
  }
</script>

<a href={url} class:solved class:small {style}>
  <span>{levelSum > 0 ? levelsToLevel(levels) : levelSum >= 0 ? 0 : ""}</span>
  <svg fill="none" viewBox="0 0 48 48">
    {#if categories.length > 0}
      {#each categories as { category, level, sum }, i}
        <circle
          stroke={categoryColors[category]}
          stroke-dashoffset={-((sum - level) / levelSum) * (40 * Math.PI)}
          stroke-dasharray="{(level / levelSum) * (40 * Math.PI)} {40 * Math.PI}"
        />
      {/each}
    {:else}
      <circle class="background" />
    {/if}
  </svg>
</a>

<style>
  a {
    position: relative;
    display: inline-flex;
    box-sizing: border-box;
    width: 3em;
    height: 3em;
    font-family: Montserrat;
    font-weight: bold;
    margin: 0.25rem;
    transition: transform 0.15s cubic-bezier(0, 0.55, 0.45, 1);
  }
  a:hover {
    transform: scale(1.15);
    /* text-decoration: underline; */
  }
  span {
    position: absolute;
    display: inline-flex;
    width: 100%;
    height: 100%;
    z-index: 1;
    font-size: 1.125em;
    align-items: center;
    justify-content: center;
    text-align: center;
    flex-shrink: 0;
  }
  svg {
    width: 3em;
    height: 3em;
  }
  circle {
    r: 20px;
    cx: 50%;
    cy: 50%;
    stroke-width: 4;
    transform: rotate(90deg);
    transform-origin: center;
    cursor: pointer;
  }
  .background {
    stroke: rgba(var(--text-color), calc(var(--background-opacity) * 24));
  }
  .solved {
    opacity: 0.375;
  }
  .small {
    font-size: 0.875em;
    /* font-size: 0.9375em; */
  }
</style>
