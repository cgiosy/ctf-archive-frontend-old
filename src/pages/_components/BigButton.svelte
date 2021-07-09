<script lang="ts">
  import CircleSpinner from "./CircleSpinner.svelte";
  import ErrorMessage from "./ErrorMessage.svelte";

  export let onClick: svelte.JSX.MouseEventHandler<HTMLButtonElement> | undefined = undefined;
  export let status: "loading" | "error" | "success" | undefined = undefined;
  export let errorMsg: string = "";
</script>

<button class={status} on:click={onClick} disabled={status === "loading"}>
  {#if status === "loading"}
    <CircleSpinner />
  {:else}
    {#if status === "error"}
      <ErrorMessage fadeout={true}>{errorMsg}</ErrorMessage>
    {/if}
    <div><slot /></div>
  {/if}
</button>

<style>
  button {
    display: grid;
    color: rgb(var(--link-color));
    align-items: center;
    justify-content: center;
    background: none;
    height: 3.5em;
    /* padding: 1.25em 3em; */
    padding: 0 3em;
    margin: 0.25em 0.5em;
    border: none;
    border-radius: 2.5em;
    font-size: 1em;
    font-weight: bold;
    transition: background-color 0.25s;
    cursor: pointer;
  }
  button[disabled] {
    background-color: rgba(var(--text-color), calc(var(--background-opacity) * 0.75));
  }
  button:hover {
    background-color: rgba(var(--text-color), var(--background-opacity));
  }
  button.error > div {
    grid-area: 1 / 1 / 2 / 2;
    animation: fadein linear 1.5s forwards;
  }

  @keyframes fadein {
    0% {
      transform: rotateY(90deg);
    }
    87.5% {
      transform: rotateY(90deg);
    }
    100% {
      transform: rotateY(0);
    }
  }
</style>
