<script lang="ts">
  import { categoryColors, setColorOpacity } from "../../libs/utils";
  import { ProblemCategory } from "../../types";
  import type { Levels } from "../../types";

  export let levels: Levels = [0, 0, 0, 0, 0, 0];

  let style: string;
  let index: ProblemCategory = 0;
  let prevLevels = levels;
  let inputElm: HTMLInputElement;

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
      case "W":
      case "w":
        levels[index] = Math.min((Number(levels[index]) || 0) + 1, 30) | 0;
        break;
      case "S":
      case "s":
        levels[index] = Math.max((Number(levels[index]) || 0) - 1, 0) | 0;
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
</script>

<div>
  <input
    type="number"
    min="0"
    max="30"
    bind:value={levels[index]}
    on:keydown={onKeyDown}
    bind:this={inputElm}
    {style}
  />
  <svg fill="none" width="192" height="192" viewBox="0 0 192 192">
    {#each [ProblemCategory.Crypto, ProblemCategory.Reversing, ProblemCategory.Pwnable, ProblemCategory.Misc, ProblemCategory.Forensic, ProblemCategory.Web] as category, i}
      <circle
        class="{index === category ? 'focused' : ''} {levels[category] > 0 ? 'selected' : ''}"
        stroke={categoryColors[category]}
        stroke-dashoffset={`${i * 40}%`}
        on:click={() => {
          index = category;
          levels[index] = levels[index] !== 1 ? Math.max(levels[index], 1) : 0;
          inputElm.focus();
        }}
      />
    {/each}
  </svg>
</div>

<style>
  div {
    position: relative;
    margin: 0.1875em;
  }
  input {
    position: absolute;
    display: inline-flex;
    top: 24px;
    left: 24px;
    width: 144px;
    height: 144px;
    z-index: 1;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 50%;
    background: rgb(var(--background-color));
    font-family: Montserrat;
    font-weight: bold;
    font-size: 4em;
    text-align: center;
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
  circle {
    cx: 50%;
    cy: 50%;
    r: 37.5%;
    stroke-width: 12.5%;
    stroke-dasharray: 40% 200%;
    cursor: pointer;
    opacity: 0.5;
    transition: stroke-width 0.05s ease-in-out, opacity 0.1s;
  }
  input:focus + svg > circle.focused,
  circle:hover {
    stroke-width: 25%;
  }
  circle:hover {
    opacity: 0.75;
  }
  circle.selected {
    opacity: 1;
  }

  @media (min-width: 64em) {
    div {
      margin-right: 1em;
    }
  }
</style>
