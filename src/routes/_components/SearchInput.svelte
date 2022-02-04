<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import TextInput from "./TextInput.svelte";
  import { useVars, parseSearchQuery } from "../../libs/utils";
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

  const compareSuggestion = (a: ISuggestion, b: ISuggestion) => a.score - b.score;

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
      /*
      case "Tab":
        if (query === "") return;
      */
      case "Escape":
        blur();
        break;
      case "Enter":
        if (!(selectedIndex in suggestions)) submit();
        else applySuggestion(suggestions[selectedIndex]);
        break;
      case "ArrowUp":
        if (suggestions.length > 0)
          selectedIndex = (Math.max(selectedIndex, 0) || suggestions.length) - 1;
        focus();
        break;
      case "ArrowDown":
        if (suggestions.length > 0) selectedIndex = (selectedIndex + 1) % suggestions.length;
        focus();
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
        focus();
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
    useVars(focused);
    const newSuggestions = suggest(parseSearchQuery(query));
    newSuggestions.sort(compareSuggestion);
    suggestions = newSuggestions;
  }
  $: {
    selectedIndex = 0;
    const newSuggestions = suggest(parseSearchQuery(query));
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
    on:click={focus}
    on:focus={focus}
    on:blur={blur}
  />
  <ul class:focused={focused && suggestions.length > 0}>
    {#each suggestions as suggestion, i (suggestion)}
      <li
        class:selected={i === selectedIndex}
        on:mouseup={() => applySuggestion(suggestion)}
        on:mousemove={() => (selectedIndex = i)}
      >
        <span class="value">{suggestion.value}</span>
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
    opacity: 0;
    pointer-events: none;
    visibility: hidden;
    width: 100%;
    top: 100%;
    left: 0;
    list-style: none;
    max-height: 24em;
    overflow: hidden scroll;
    margin: 0.625em 0;
    padding: 0;
    background: rgb(var(--background-color));
    box-shadow: 0 0.125em 0.75em 0 rgba(var(--text-color), calc(var(--background-opacity) * 4));
    z-index: 3;
    transition: opacity 0.175s, visibility 0.175s;
  }
  .focused,
  ul:hover,
  ul:active {
    opacity: 1;
    pointer-events: all;
    visibility: visible;
  }
  li {
    display: inline-flex;
    align-items: center;
    /* justify-content: space-between; */
    width: 100%;
    padding: 0.5em 1em;
    transition: background 0.175s;
    cursor: pointer;
  }
  /* li:hover, */
  .selected {
    background: rgba(var(--text-color), calc(var(--background-opacity) * 2));
  }
  .value {
    font-family: var(--font-family-monospace);
  }
  .caption {
    color: rgba(var(--text-color), calc(var(--background-opacity) * 12));
    font-size: 0.875em;
    margin-left: 1.25em;
  }
</style>
