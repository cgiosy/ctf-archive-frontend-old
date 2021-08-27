<script lang="ts">
  export let large: boolean = false;
  export let monospace: boolean = false;
  export let value: string | number | string[] | null | undefined = "";
  export let onEnter: Function | undefined = undefined;

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && onEnter !== undefined) onEnter();
  };

  const classes: string[] = [];
  if (large) classes.push("large");
  if (monospace) classes.push("monospace");
</script>

<label class={classes.join(" ")}>
  <input placeholder=" " spellcheck={false} bind:value on:keydown={onKeyDown} {...$$restProps} />
  <div><slot /></div>
</label>

<style>
  label {
    display: block;
    position: relative;
    width: 100%;
    margin: 0.375em;
  }
  .large {
    font-size: 1.5em;
  }
  .monospace,
  .monospace * {
    font-family: var(--font-family-monospace);
  }
  input,
  div {
    display: block;
    font-family: var(--font-family);
    line-height: 1;
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
  input {
    contain: size;
    width: 100%;
    padding: 0.6875em 0.9375em;
    background: rgb(var(--background-color));
    border-radius: 0.25em;
    border: 0.0625em solid rgba(var(--text-color), calc(var(--background-opacity) * 5));
    transition: border-color 0.15s, box-shadow 0.15s;
    z-index: 1;
  }
  label:hover > input,
  input:focus {
    box-shadow: 0 0.0625em 0.375em 0 rgba(var(--text-color), calc(var(--background-opacity) * 3));
  }
  input:focus {
    padding: 0.625em 0.875em;
    border-width: 0.125em;
    border-color: rgb(var(--link-color));
    outline: none;
  }
  input:focus + div {
    color: rgb(var(--link-color));
  }
  input:focus + div,
  input:not(:placeholder-shown) + div {
    background: rgb(var(--background-color));
    transform: translateY(-1.1875em) scale(0.666);
  }
</style>
