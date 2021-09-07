<script lang="ts">
  import { categoryColors, expToLevel } from "../../libs/utils";
  import type { Exps, ProblemCategory } from "../../types";

  export let url: string | undefined = undefined;
  export let exps: Exps = [-Infinity, -Infinity, -Infinity, -Infinity, -Infinity, -Infinity];
  export let small: boolean = false;

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

    ({ level, remain, percentage } = expToLevel(expSum));
  }
</script>

<a href={url} class={`${small ? "small " : ""}circle`} {style}>
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
      <circle stroke="#000" />
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
  circle {
    cx: 24;
    cy: 24;
    r: 20;
    stroke-width: 4;
    transform: rotate(90deg);
    transform-origin: center;
    cursor: pointer;
  }
  .small {
    font-size: 0.875em;
    /* font-size: 0.9375em; */
  }
</style>
