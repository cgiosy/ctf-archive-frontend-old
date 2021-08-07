<script lang="ts">
  import type { MutationStoreResult } from "@sveltestack/svelte-query";
  import { toLocaleErrorMessage } from "../../libs/error_message";

  import CircleSpinner from "./CircleSpinner.svelte";
  import ErrorMessage from "./ErrorMessage.svelte";

  export let mutation: MutationStoreResult;
  export let args: any = undefined;

  const mutate = () => {
    $mutation.mutate(args);
  };
</script>

<button on:click={mutate} class={$mutation.status} disabled={$mutation.isLoading}>
  {#if $mutation.isLoading === true}
    <CircleSpinner />
  {:else}
    {#if $mutation.isError === true}
      <ErrorMessage fadeout={true}>{toLocaleErrorMessage($mutation.error)}</ErrorMessage>
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
