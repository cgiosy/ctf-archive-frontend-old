<script lang="ts">
  import { style, expToLevel } from "../../libs/utils";

  export let exp: number = 0;
  export let height: string = "0.125rem";
  export let inset: boolean = false;

  const colors = ["rgb(255, 0, 80)", "rgb(255, 0, 32)"];

  let level: number;
  let percentage: number;

  const mixedColors = (colors: string[]): string => {
    const percentage = 100 / colors.length;
    return `linear-gradient(to right, ${colors
      .map((color, index) => `${color} ${percentage * (index + 1)}%`)
      .join(", ")})`;
  };

  $: ({ level, percentage } = expToLevel(exp));
</script>

<div
  class="bar"
  class:inset
  style={style({
    height,
  })}
>
  <div
    class="gauge"
    style={style({
      width: percentage + "%",
      "background-image": mixedColors(colors),
      "box-shadow": "0 0 0.75rem 0.0625em " + colors[colors.length - 1],
    })}
  />
  <div
    class="light"
    style={style({ "box-shadow": "-0.125rem 0 1rem " + colors[colors.length - 1] })}
  />
</div>

<style>
  .bar {
    display: flex;
    width: 100%;
    background-color: black;
  }
  .inset {
    overflow: hidden;
  }
  .gauge,
  .light {
    display: inline-flex;
    height: 100%;
  }
  .light {
    width: 0;
  }
</style>
