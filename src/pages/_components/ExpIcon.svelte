<script lang="ts">
  import { categoryColors, expToLevel } from "../../libs/utils";
  import type { Exps, ProblemCategory } from "../../types";

  export let url: string | undefined = undefined;
  export let exps: Exps = [-Infinity, -Infinity, -Infinity, -Infinity, -Infinity, -Infinity];
  export let small: boolean = false;

  const toBorder = (color: string): string => `border: 0.25em solid ${color}`;

  let expSum = 0;
  const categories = exps
    .map((exp, category: ProblemCategory) => ({ exp, category }))
    .filter(({ exp }) => exp > 0)
    .map(({ exp, category }) => ({
      sum: (expSum += exp),
      exp,
      category,
    }));
  const { level, remain, percentage } = expToLevel(expSum);

  const deg = 360 / expSum;
  const style =
    categories.length === 0
      ? toBorder("rgb(var(--text-color))")
      : categories.length === 1
      ? toBorder(categoryColors[categories[0].category])
      : `background-image: linear-gradient(rgb(var(--background-color)), rgb(var(--background-color))), conic-gradient(${categories
          .map(
            ({ sum, exp, category }) =>
              `${categoryColors[category]} ${deg * (sum - exp)}deg ${deg * sum}deg`
          )
          .join(", ")})`;
</script>

<a
  href={url}
  class={`${categories.length >= 2 ? "mixed " : ""}${small ? "small " : ""}circle`}
  {style}>{expSum >= 0 ? level : ""}</a
>

<style>
  .circle {
    display: inline-flex;
    box-sizing: border-box;
    width: 2.5em;
    height: 2.5em;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-family: Montserrat;
    font-weight: bold;
    font-size: 1.1em;
    margin: 0.25rem;
    flex-shrink: 0;
    transition: transform 0.15s cubic-bezier(0, 0.55, 0.45, 1);
  }
  .circle:hover {
    transform: scale(1.15);
    /* text-decoration: underline; */
  }
  .mixed {
    border: double 0.25em transparent;
    background-origin: border-box;
    background-clip: content-box, border-box;
  }
  .small {
    font-size: 0.875em;
    /* font-size: 0.9375em; */
  }
</style>
