<script lang="ts">
  import { _ } from "svelte-i18n";
  import type { MutationStoreResult } from "@sveltestack/svelte-query";

  import CircleSpinner from "./CircleSpinner.svelte";
  import ErrorMessage from "./ErrorMessage.svelte";

  export let mutation: MutationStoreResult<any>;
  export let disabled: boolean = false;
  export let loading: boolean = false;
  export let hidden: boolean = false;
  export let args: any = undefined;

  const mutate = () => {
    $mutation.mutate(args);
  };

  const errorMessage = (error: unknown) =>
    $_(`error.${error instanceof Error ? error.message : "default"}`, {
      default: $_("error.default") || "Error occurred!",
    });
</script>

<button
  on:click={mutate}
  class={$mutation.status}
  disabled={disabled || loading || $mutation.isLoading}
  {hidden}
>
  {#if loading || $mutation.isLoading}
    <CircleSpinner />
  {:else}
    {#if $mutation.isError}
      <ErrorMessage fadeout={true}>{errorMessage($mutation.error)}</ErrorMessage>
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
    user-select: none;
  }
  button[hidden] {
    display: none;
  }
  button[disabled] {
    background-color: rgba(var(--text-color), calc(var(--background-opacity) * 0.75));
    pointer-events: none;
  }
  button:hover,
  button:focus {
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
