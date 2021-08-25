<script lang="ts">
  import { categoryColors, setColorOpacity } from "../../libs/utils";
  import { ProblemCategory } from "../../types";
  import type { Levels } from "../../types";

  export let levels: Levels = [0, 0, 0, 0, 0, 0];

  let style: string;
  let index: ProblemCategory = 0;
  let prevLevels = levels;

  const onKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "A":
      case "a":
        index = index === 0 ? 5 : index - 1;
        break;
      case "D":
      case "d":
        index = index === 5 ? 0 : index + 1;
        break;
    }
  };

  $: {
    /*
    if (levels.every((level) => 0 <= level && level <= 30 && Number.isInteger(level)))
      prevLevels = [...levels];
    else levels = [...prevLevels];
    */
  }
  $: style = `background-image: linear-gradient(rgb(var(--background-color)), rgb(var(--background-color))), conic-gradient(${[
    ProblemCategory.Pwnable,
    ProblemCategory.Reversing,
    ProblemCategory.Crypto,
    ProblemCategory.Web,
    ProblemCategory.Forensic,
    ProblemCategory.Misc,
  ]
    .map(
      (category) =>
        `${setColorOpacity(categoryColors[category], levels[category] > 0 ? 1 : 1 / 3)} ${
          60 * category
        }deg ${60 * (category + 1)}deg`
    )
    .join(", ")})`;
</script>

<input type="number" min="0" max="30" bind:value={levels[index]} on:keydown={onKeyDown} {style} />

<style>
  input {
    display: inline-flex;
    box-sizing: border-box;
    width: 3em;
    height: 3em;
    align-items: center;
    justify-content: center;
    border: double 0.1875em transparent;
    background-origin: border-box;
    background-clip: content-box, border-box;
    border-radius: 50%;
    font-family: Montserrat;
    font-weight: bold;
    font-size: 4em;
    text-align: center;
    margin: 0.1875em;
    flex-shrink: 0;
    transition: transform 0.15s cubic-bezier(0, 0.55, 0.45, 1);

    -moz-appearance: textfield;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input:focus {
    outline: none;
  }

  @media (min-width: 64em) {
    input {
      margin-right: 1em;
    }
  }
</style>
