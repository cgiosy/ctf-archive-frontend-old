<script lang="ts">
  import { randomInt } from "../../libs";

  export let level: number | "" = "";
  export let categories: string[] = [];
  export let url: string = `/?q=${level} ${categories.join(" ")}`;
  export let solved: boolean = randomInt(2) === 0;

  const getColor = (category: string): string => {
    return (
      {
        pwn: "rgb(252, 40, 157)",
        rev: "rgb(78, 224, 174)",
        crypto: "rgb(247, 147, 7)",
        web: "rgb(66, 198, 220)",
        fore: "rgb(241, 222, 64)",
        misc: "rgb(164, 109, 254)",
      }[category] ?? category
    );
  };

  const singleColor = (color: string): string => `border: 0.25em solid ${getColor(color)}`;

  const mixedColors = (colors: string[]): string => {
    if (colors.length === 0) return singleColor("rgb(var(--text-color))");
    if (colors.length === 1) return singleColor(colors[0]);
    colors.sort();

    const deg = 360 / colors.length;
    return `background-image: linear-gradient(rgb(var(--background-color)), rgb(var(--background-color))), conic-gradient(${colors
      .map((color, index) => `${getColor(color)} ${deg * index}deg ${deg * (index + 1)}deg`)
      .join(", ")})`;
  };
</script>

<a
  href={url}
  class={`${categories.length >= 2 ? "mixed " : ""}${solved ? "solved " : ""}circle`}
  style={mixedColors(categories.map(getColor))}>{level}</a
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
    color: rgb(var(--green));
  }
</style>
