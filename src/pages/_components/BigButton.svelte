<script lang="ts">
  export let onClick: svelte.JSX.MouseEventHandler<HTMLButtonElement> | undefined = undefined;
</script>

<button on:click={onClick}><slot /></button>

<style>
  button {
    display: inline-flex;
    justify-content: center;
    color: rgb(var(--link-color));
    background: none;
    padding: 1.25em 3em;
    margin: 0.25em 0.5em;
    border: none;
    border-radius: 2.5em;
    font-size: 1em;
    font-weight: bold;
    transition: background-color 0.25s;
    cursor: pointer;
  }
  button:hover {
    background-color: rgba(var(--text-color), var(--background-opacity));
  }
</style>
