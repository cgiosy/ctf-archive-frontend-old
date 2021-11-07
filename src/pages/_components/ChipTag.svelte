<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { tagToTid, tidToTag } from "../../constants/tags";
  import { style, tagEditDistance } from "../../libs/utils";

  export let tid: number | undefined;

  const dispatch = createEventDispatcher();

  let tag: string = "";

  const onFocusout = () => {
    let minTag = "";
    let minDist = 0x7fffffff;
    for (const newTag in tagToTid) {
      const dist = tagEditDistance(tag, newTag);
      if (dist < minDist) {
        minDist = dist;
        minTag = newTag;
      }
    }
    const minTid = tagToTid[minTag];
    if (minDist < minTag.length && tag) {
      tid = minTid;
      tag = tidToTag[tid][0];
    } else {
      tid = undefined;
      tag = "";
    }
    dispatch("inputend", { tid, tag });
  };

  $: tag = (tid !== undefined && tidToTag[tid] && tidToTag[tid][0]) || "";
</script>

<input
  bind:value={tag}
  on:blur={onFocusout}
  placeholder="태그"
  maxlength="63"
  style={style({ "--width": 5 + tag.length + "ch" })}
/>

<style>
  input {
    display: inline-block;
    min-width: 6em;
    width: var(--width);
    margin: 0.125em 0.25em;
    padding: 0.375em 1.5em;
    font-family: var(--font-family-monospace);
    background: rgba(var(--text-color), calc(var(--background-opacity) * 2.5));
    border: none;
    border-radius: 3px;
    text-align: center;
    transition: background 0.175s;
  }
  input:hover,
  input:focus {
    background: rgba(var(--text-color), calc(var(--background-opacity) * 4));
  }
</style>
