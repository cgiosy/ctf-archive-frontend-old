<script lang="ts">
  import { categoryColors, levelsToCategories, levelsSum, reduceMap } from "../../libs/utils";
  import type { Levels } from "../../types";

  export let url: string | undefined = undefined;
  export let levels: Levels = [0, 0, 0, 0, 0, 0];
  export let solved: boolean = false;
  export let small: boolean = false;

  const toBorder = (color: string): string => `border: 0.25em solid ${color}`;

  const categories = levelsToCategories(levels);
  const nonzeroLevels = levels.filter((x) => x > 0);
  const levelSum = levelsSum(levels);

  const deg = 360 / levelSum;
  const style =
    categories.length === 0
      ? toBorder("rgb(var(--text-color))")
      : categories.length === 1
      ? toBorder(categoryColors[categories[0]])
      : `background-image: linear-gradient(rgb(var(--background-color)), rgb(var(--background-color))), conic-gradient(${reduceMap(
          categories,
          (sum, category, index) => [
            sum + nonzeroLevels[index],
            `${categoryColors[category]} ${deg * sum}deg ${deg * (sum + nonzeroLevels[index])}deg`,
          ],
          0
        ).join(", ")})`;
</script>

<a
  href={url}
  class={`${categories.length >= 2 ? "mixed " : ""}${solved ? "solved " : ""}${
    small ? "small " : ""
  }circle`}
  {style}>{levelSum}</a
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
    font-size: 1.125em;
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
  .solved {
    opacity: 0.375;
  }
  .small {
    font-size: 0.875em;
    /* font-size: 0.9375em; */
  }
</style>
