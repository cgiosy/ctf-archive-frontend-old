<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { style } from "../../libs/utils";

  export let size: number = 1;
  export let monospace: boolean = false;
  export let value: string | number | string[] | null | undefined = "";
  export let input: HTMLTextAreaElement | undefined = undefined;

  const dispatch = createEventDispatcher();

  const fowardEvent = (e: Event) => {
    dispatch(e.type, e);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") dispatch("enter");
    fowardEvent(e);
  };
</script>

<label class:monospace style={style({ "--size": size + "em" })}>
  <textarea
    placeholder=" "
    spellcheck={false}
    bind:this={input}
    bind:value
    on:keydown={onKeyDown}
    on:focus={fowardEvent}
    on:blur={fowardEvent}
    {...$$restProps}
  />
  <div><slot /></div>
</label>

<style>
  label {
    display: block;
    position: relative;
    width: 100%;
    margin: 0.375em;
    font-size: var(--size);
  }
  .monospace,
  .monospace * {
    font-family: var(--font-family-monospace);
  }
  textarea,
  div {
    display: block;
    font-family: var(--font-family);
    line-height: normal;
    cursor: text;
  }
  div {
    position: absolute;
    display: inline;
    /* top: 0.75em; */
    top: 0.875em;
    left: 0.5em;
    padding: 0 0.5em;
    color: rgba(var(--text-color), calc(var(--background-opacity) * 10));
    transition: color 0.15s, transform 0.15s;
    transform-origin: top left;
    user-select: none;
  }
  textarea {
    contain: size;
    width: 100%;
    padding: 0.6875em 0.9375em;
    background: rgb(var(--background-color));
    border-radius: 0.25em;
    border: 0.0625em solid rgba(var(--text-color), calc(var(--background-opacity) * 5));
    transition: border-color 0.15s, box-shadow 0.15s;
    z-index: 1;
  }
  textarea:hover,
  textarea:focus {
    box-shadow: 0 0.0625em 0.375em 0 rgba(var(--text-color), calc(var(--background-opacity) * 3));
  }
  textarea:focus {
    padding: 0.625em 0.875em;
    border-width: 0.125em;
    border-color: rgb(var(--link-color));
    outline: none;
  }
  textarea:focus + div {
    color: rgb(var(--link-color));
  }
  textarea:focus + div,
  textarea:not(:placeholder-shown) + div {
    background: rgb(var(--background-color));
    transform: translateY(-1.375em) scale(0.666);
  }
</style>
