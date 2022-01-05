<script lang="ts">
  import { categoryColors, setColorOpacity, useVars } from "../../libs/utils";
  import { ProblemCategory } from "../../types";
  import type { Levels } from "../../types";

  export let levels: Levels = [0, 0, 0, 0, 0, 0];

  let style: string;
  let index: ProblemCategory = 0;
  let prevLevels = levels;
  let inputElm: HTMLInputElement;

  const numberToLevel = (x: number) => Math.min(Math.max(x, 0), 30) | 0;

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

  const onScroll = (e: WheelEvent) => {
    if (document.activeElement === inputElm) {
      levels[index] = numberToLevel((Number(levels[index]) || 0) - Math.sign(e.deltaY));
      e.preventDefault();
    }
  };

  const selectedLevels = (levels: Levels) =>
    levels.map((level, index) => ({ level, index })).filter(({ level }) => level > 0);

  const onChange = () => {
    let eq = true;
    for (let i = 0; i < 6; i++) {
      levels[i] = numberToLevel(levels[i]);
      eq = eq && levels[i] === prevLevels[i];
    }
    if (inputElm != null) inputElm.value = levels[index].toString();
    if (!eq) {
      const indexes = selectedLevels(levels);
      const prevIndexes = selectedLevels(prevLevels);
      if (indexes.length === 1 && prevIndexes.length <= 1) ({ index } = indexes[0]);
      prevLevels = [...levels];
    }
  };

  index = selectedLevels(levels)[0]?.index ?? 0;

  $: useVars(levels), onChange();
</script>

<div on:wheel={onScroll}>
  <input
    type="number"
    min="0"
    max="30"
    bind:value={levels[index]}
    on:keydown={onKeyDown}
    bind:this={inputElm}
    {style}
  />
  <svg fill="none" viewBox="0 0 240 240">
    {#each [0, 10, 20] as level}
      <circle
        class="guide"
        stroke-dasharray="4"
        stroke-width="1"
        r={96 + ((level * 1.5) / 30) * 24}
      />
    {/each}
    {#each [ProblemCategory.Pwnable, ProblemCategory.Reversing, ProblemCategory.Crypto, ProblemCategory.Web, ProblemCategory.Forensic, ProblemCategory.Misc] as category, i}
      <circle
        class:focused={index === category}
        class:selected={levels[category] > 0}
        stroke={categoryColors[category]}
        stroke-dashoffset={-((i * (144 + ((levels[category] * 2) / 30) * 24)) / 6) * Math.PI}
        stroke-dasharray="{((144 + ((levels[category] * 2) / 30) * 24) / 6) * Math.PI} {192 *
          Math.PI}"
        stroke-width={24 + (levels[category] / 30) * 24}
        r={72 + (levels[category] / 30) * 24}
        on:click={() => {
          index = category;
          // levels[index] = levels[index] !== 1 ? Math.max(levels[index], 1) : 0;
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
    top: 0.825em;
    left: 0.825em;
    width: 2.375em;
    height: 2.375em;
    z-index: 1;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 50%;
    background: rgb(var(--background-color));
    font-family: Montserrat;
    font-weight: bold;
    font-size: 3em;
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
  svg {
    width: 12em;
    height: 12em;
  }
  circle {
    cx: 50%;
    cy: 50%;
    cursor: pointer;
    opacity: 0.4;
    transform: rotate(240deg);
    transform-origin: center;
    transition: opacity 0.1s;
  }
  .guide {
    stroke: rgba(var(--text-color), calc(var(--background-opacity) * 5));
    cursor: unset;
    opacity: 1;
  }
  /*
  input:focus + svg > circle.focused,
  circle:hover {
    stroke-width: 48;
  }
  */
  input:focus + svg > circle.focused,
  circle:hover {
    opacity: 0.75;
  }
  input:focus + svg > circle.selected,
  circle.selected {
    opacity: 1;
  }

  @media (min-width: 64em) {
    div {
      margin-right: 1em;
    }
  }
</style>
