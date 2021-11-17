<script lang="ts">
  import ChipTag from "./ChipTag.svelte";
  import { tidToTag } from "../../constants/tags";
  import { style, tagEditDistance } from "../../libs/utils";

  interface ISuggestion {
    tid: number;
    score: number;
  }

  export let tags: number[];
  export let suggestions: ISuggestion[] = [];
  export let modified: boolean = false;
  let tag: string = "";
  let tagInput: HTMLInputElement;
  let selectedSuggestionId = -1;

  const compNum = (a: ISuggestion, b: ISuggestion) => a.score - b.score || a.tid - b.tid;

  const inputTag = (e: MouseEvent) => {
    e.preventDefault();
    if (document.activeElement !== tagInput) tagInput.focus();
  };

  const getSuggestions = (): ISuggestion[] => {
    if (!tag) return [];
    const newSuggestions: ISuggestion[] = [];
    for (let tid = 0; tid < tidToTag.length; tid++)
      if (!tags.includes(tid)) {
        let score = 0x7fffffff;
        for (const newTag of tidToTag[tid]) {
          const dist = tagEditDistance(tag, newTag);
          if (dist < newTag.length) score = Math.min(score, dist);
        }
        if (score !== 0x7fffffff) newSuggestions.push({ tid, score });
      }
    newSuggestions.sort(compNum);
    return newSuggestions;
  };

  const applySuggestion = (suggestion: ISuggestion | null | undefined) => {
    if (suggestion == null) return;
    const { tid } = suggestion;

    selectedSuggestionId = -1;
    suggestions = [];
    tag = "";
    tags = [...tags, tid];
    modified = true;
    tagInput.focus();
  };

  const suggest = () => {
    selectedSuggestionId = -1;
    suggestions = getSuggestions();
  };

  const keyEvent = (e: KeyboardEvent) => {
    switch (e.key) {
      case "Tab":
        if (tag === "") return;
      case "Enter":
        applySuggestion(suggestions[selectedSuggestionId]);
        break;
      case "Backspace":
      case "Delete":
        if (tag !== "") return;
        tags.pop();
        tags = tags;
        modified = true;
        break;
      case "ArrowUp":
        if (suggestions.length > 0)
          selectedSuggestionId = (Math.max(selectedSuggestionId, 0) || suggestions.length) - 1;
        break;
      case "ArrowDown":
        if (suggestions.length > 0)
          selectedSuggestionId = (selectedSuggestionId + 1) % suggestions.length;
        break;
      default:
        return;
    }
    e.preventDefault();
  };

  const changeTag = (e: { detail: number }) => {
    const tid = e.detail;
    tags = tags.filter((tag) => tag !== tid);
    tag = tidToTag[tid][0];
    modified = true;
    tagInput.focus();
    setTimeout(() => {
      tagInput.focus();
      tagInput.select();
    });
  };
</script>

<div on:click={inputTag}>
  {#each tags as tid}
    <ChipTag {tid} on:click={changeTag} />
  {/each}
  <input
    type="text"
    placeholder="태그 입력"
    bind:this={tagInput}
    bind:value={tag}
    on:input={suggest}
    on:keydown={keyEvent}
    maxlength="63"
    style={style({ "--width": 1 + tag.length + "ch" })}
  />
  <ul>
    {#each suggestions as suggestion, i}
      <li
        class={i === selectedSuggestionId ? "selected" : ""}
        on:click={() => applySuggestion(suggestion)}
        on:mousemove={() => (selectedSuggestionId = i)}
      >
        <span>{tidToTag[suggestion.tid][0]}</span>
      </li>
    {/each}
  </ul>
</div>

<style>
  div {
    position: relative;
    display: block;
    padding: 0.5em 1em;
    margin-top: 0.5em;
    margin-bottom: 2em;
    border: 0.0625em solid rgba(var(--text-color), calc(var(--background-opacity) * 5));
    border-radius: 0.25em;
    cursor: text;
  }
  input {
    width: var(--width);
    padding: 0.625em 0.25em;
    border: none;
    background: none;
    outline: none;
    font-family: var(--font-family-monospace);
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
  input:focus + ul,
  input:active + ul,
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
</style>
