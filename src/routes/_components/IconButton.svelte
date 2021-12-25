<script lang="ts">
  export let onClick: (
    event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }
  ) => any;
</script>

<button on:click={onClick}><slot /></button>

<style>
  button {
    display: inline-flex;
    color: rgb(var(--text-color));
    width: 2em;
    height: 2em;
    align-items: center;
    justify-content: center;
    background: none;
    margin: 0.125em;
    font-size: 1.5em;
    border: none;
    border-radius: 50%;
    transition: background-color 0.25s;
    cursor: pointer;
    user-select: none;
  }
  button:hover {
    background-color: rgba(var(--text-color), var(--background-opacity));
  }
</style>
