<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import TextInput from "./TextInput.svelte";
  import { parseSearchQuery } from "../../libs/utils";
  import type { ISearchQuery, ISuggestion } from "../../types";

  export let placeholder: string;
  export let maxlength: number = 63;
  export let suggest: Function; // (query: ISearchQuery) => ISuggestion[];
  export let query: string = "";
  let suggestions: ISuggestion[] = [];
  let selectedIndex: number = 0;
  let focused: boolean = false;
  let input: HTMLInputElement;

  const dispatch = createEventDispatcher();

  const compareSuggestion = (a: ISuggestion, b: ISuggestion) =>
    a.score - b.score || a.types - b.types;

  const applySuggestion = (suggestion: ISuggestion) => {
    dispatch("add", suggestion);
    query = "";
    suggestions = [];
    selectedIndex = 0;
    input.focus();
  };

  const submit = () => {
    dispatch("submit", { query });
  };

  const keyEvent = ({ detail: e }: CustomEvent<KeyboardEvent>) => {
    switch (e.key) {
      case "Tab":
        if (query === "") return;
      case "Enter":
        if (!(selectedIndex in suggestions)) submit();
        else applySuggestion(suggestions[selectedIndex]);
        break;
      case "ArrowUp":
        if (suggestions.length > 0)
          selectedIndex = (Math.max(selectedIndex, 0) || suggestions.length) - 1;
        break;
      case "ArrowDown":
        if (suggestions.length > 0) selectedIndex = (selectedIndex + 1) % suggestions.length;
        break;
      // TODO: 이전 입력들 불러와서 삭제?
      /*
      case "Backspace":
      case "Delete":
        if (query !== "") return;
        queries.pop();
        queries = queries;
        modified = true;
        break;
      */
      default:
        return;
    }
    e.preventDefault();
  };

  const focus = () => {
    focused = true;
  };

  const blur = () => {
    focused = false;
  };

  $: {
    selectedIndex = 0;
    const newSuggestions = suggest(parseSearchQuery("#" + query));
    newSuggestions.sort(compareSuggestion);
    suggestions = newSuggestions;
  }
</script>

<div>
  <TextInput
    type="text"
    monospace
    bind:input
    {placeholder}
    {maxlength}
    size={1.15}
    bind:value={query}
    on:keydown={keyEvent}
    on:focus={focus}
    on:blur={blur}
  />
  <ul class:focused>
    {#each suggestions as suggestion, i (suggestion)}
      <li
        class:selected={i === selectedIndex}
        on:click={() => applySuggestion(suggestion)}
        on:mousemove={() => (selectedIndex = i)}
      >
        <span>{suggestion.value}</span>
        <span class="caption">{suggestion.caption}</span>
      </li>
    {/each}
  </ul>
</div>

<style>
  div {
    position: relative;
  }
  ul {
    position: absolute;
    pointer-events: none;
    opacity: 0;
    width: 100%;
    top: 100%;
    left: 0;
    list-style: none;
    max-height: 24em;
    overflow: hidden scroll;
    margin: 0.5em 0;
    padding: 0;
    background: rgb(var(--background-color));
    box-shadow: 0 0.125em 0.75em 0 rgba(var(--text-color), calc(var(--background-opacity) * 4));
    z-index: 1;
    transition: opacity 0.175s;
  }
  .focused,
  ul:hover,
  ul:active {
    opacity: 1;
    pointer-events: all;
  }
  li {
    padding: 0.5em 1em;
    transition: background 0.175s;
    cursor: pointer;
  }
  /* li:hover, */
  .selected {
    background: rgba(var(--text-color), calc(var(--background-opacity) * 2));
  }
  span.caption {
    text-align: right;
    color: rgba(var(--text-color), calc(var(--background-color) * 4));
  }
</style>
