<script lang="ts">
  import { categoryColors, expToLevel } from "../../libs/utils";
  import type { Exps, ProblemCategory } from "../../types";

  export let url: string | undefined = undefined;
  export let exps: Exps = [-Infinity, -Infinity, -Infinity, -Infinity, -Infinity, -Infinity];
  export let small: boolean = false;
  export let stopped: boolean = false;

  let expSum: number;
  let categories: { sum: number; exp: number; category: ProblemCategory }[];
  let style: string;
  let level: number;
  let remain: number;
  let percentage: number;

  const toBorder = (color: string): string => `border: 0.25em solid ${color}`;

  $: {
    const tempCategories = exps.map((exp, category: ProblemCategory) => ({
      category,
      exp,
      sum: 0,
    }));

    expSum = tempCategories.reduce((sum, { exp }) => sum + exp, 0);
    categories = tempCategories.filter(({ exp }) => exp > expSum / 25);

    categories.sort(({ exp: exp1 }, { exp: exp2 }) => exp2 - exp1);

    let expSum2 = 0;
    categories.forEach((val) => {
      val.sum = expSum2 += val.exp;
    });
    expSum = expSum2;

    ({ level, remain, percentage } = expToLevel(expSum));
  }
</script>

<a href={url} class="circle" class:small class:stopped {style}>
  <span>{expSum >= 0 ? level : ""}</span>
  <svg fill="none" viewBox="0 0 48 48">
    {#if categories.length > 0}
      {#each categories as { category, exp, sum }, i}
        <circle
          stroke={categoryColors[category]}
          stroke-dashoffset={-((sum - exp) / expSum) * (40 * Math.PI)}
          stroke-dasharray="{(exp / expSum) * (40 * Math.PI)} {40 * Math.PI}"
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
  a:not(.stopped):hover {
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
  .small {
    font-size: 0.875em;
    /* font-size: 0.9375em; */
  }
</style>
