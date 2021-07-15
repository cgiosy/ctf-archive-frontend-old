<script lang="ts">
  import { randomInt } from "../../libs/utils";

  interface ICategory {
    index: number;
    levelSum: number;
  }

  export let url: string | undefined = undefined;
  export let levels: number[] = [0, 0, 0, 0, 0];
  export let solved: boolean = randomInt(2) === 0;

  const getColor = (category: number): string => {
    return (
      {
        0: "rgb(240, 98, 146)",
        1: "rgb(179, 136, 255)",
        2: "rgb(255, 112, 67)",
        3: "rgb(100, 181, 246)",
        4: "rgb(67, 160, 71)",
        5: "rgb(97, 97, 97)",
      }[category] ?? "rgb(--text-color)"
    );
  };

  const toBorder = (color: string): string => `border: 0.25em solid ${color}`;

  let categories: ICategory[] = [];
  let levelSum = 0;
  let expSum = 0;
  for (let index = 0; index < levels.length; index++) {
    const level = levels[index];
    if (level > 0) {
      levelSum += level;
      expSum += 1 << level;
      categories.push({ index, levelSum });
    }
  }

  const deg = 360 / levelSum;
  const style =
    categories.length === 0
      ? toBorder("rgb(var(--text-color))")
      : categories.length === 1
      ? toBorder(getColor(categories[0].index))
      : `background-image: linear-gradient(rgb(var(--background-color)), rgb(var(--background-color))), conic-gradient(${categories
          .map(
            ({ index, levelSum }) =>
              `${getColor(index)} ${deg * (levelSum - levels[index])}deg ${deg * levelSum}deg`
          )
          .join(", ")})`;
</script>

<a
  href={url}
  class={`${categories.length >= 2 ? "mixed " : ""}${solved ? "solved " : ""}circle`}
  {style}>{expSum > 0 ? Math.floor(Math.log2(expSum)) : ""}</a
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
  .solved {
    opacity: 0.375;
  }
</style>
