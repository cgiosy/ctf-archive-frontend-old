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

  const toBorder = (color: string): string => `border: 0.25em solid ${color}`;

  $: {
    levelSum = 0;

    categories = levels
      .map((level, category: ProblemCategory) => ({
        sum: (levelSum += level),
        level,
        category,
      }))
      .filter(({ level }) => level > 0);

    const deg = 360 / levelSum;

    style =
      categories.length === 0
        ? toBorder("rgba(var(--text-color), calc(var(--background-opacity) * 25))")
        : categories.length === 1
        ? toBorder(categoryColors[categories[0].category])
        : `background-image: linear-gradient(rgb(var(--background-color)), rgb(var(--background-color))), conic-gradient(${categories
            .map(
              ({ sum, level, category }) =>
                `${categoryColors[category]} ${deg * (sum - level)}deg ${deg * sum}deg`
            )
            .join(", ")})`;
  }
</script>

<a
  href={url}
  class={`${categories.length >= 2 ? "mixed " : ""}${solved ? "solved " : ""}${
    small ? "small " : ""
  }`}
  {style}>{levelSum > 0 ? levelsToLevel(levels) : levelSum >= 0 ? 0 : ""}</a
>

<style>
  a {
    display: inline-flex;
    box-sizing: border-box;
    width: 2.5em;
    height: 2.5em;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-family: Montserrat;
    font-weight: bold;
    font-size: 1.125em;
    margin: 0.25rem;
    flex-shrink: 0;
    transition: transform 0.15s cubic-bezier(0, 0.55, 0.45, 1);
  }
  a:hover {
    transform: scale(1.15);
    /* text-decoration: underline; */
  }
  .mixed {
    border: double 0.25em transparent;
    background-origin: border-box;
    background-clip: content-box, border-box;
  }
  .solved {
    opacity: 0.375;
  }
  .small {
    font-size: 0.875em;
    /* font-size: 0.9375em; */
  }
</style>
