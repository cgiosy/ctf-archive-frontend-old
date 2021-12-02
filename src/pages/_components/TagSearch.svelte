<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import SearchInput from "./SearchInput.svelte";
  import Chip from "./Chip.svelte";
  import { tidToTag, tagToTid } from "../../constants/tags";
  import { getTagSuggestions } from "../../libs/utils";
  import type { ISearchQuery, ISuggestion } from "../../types";

  export let tags: number[];
  export let modified: boolean = false;

  const dispatch = createEventDispatcher();

  const submit = () => {
    dispatch("submit");
  };

  const getSuggestions = ({ value }: ISearchQuery): ISuggestion[] =>
    getTagSuggestions(value).filter((suggestion) => !tags.includes(tagToTid[suggestion.value]));

  const applySuggestion = ({ detail: suggestion }: CustomEvent<ISuggestion>) => {
    const tid = tagToTid[suggestion.value];
    tags = [...tags, tid];
    modified = true;
  };

  const removeTag = (tid: number) => {
    tags = tags.filter((tag) => tag !== tid);
    modified = true;
  };
</script>

<div>
  {#each tags as tid (tid)}
    <Chip on:click={() => removeTag(tid)}>{tidToTag[tid][0]}</Chip>
  {/each}
</div>
<SearchInput
  placeholder="Input Tag"
  suggest={getSuggestions}
  on:add={applySuggestion}
  on:submit={submit}
/>

<style>
  div {
    position: relative;
    display: block;
    margin: 0.375em;
    /* border: 0.0625em solid rgba(var(--text-color), calc(var(--background-opacity) * 5)); */
    border-radius: 0.25em;
    cursor: text;
  }
</style>
