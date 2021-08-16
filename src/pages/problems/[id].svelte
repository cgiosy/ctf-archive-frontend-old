<script lang="ts">
  import { params } from "@roxi/routify";
  import { useQuery } from "@sveltestack/svelte-query";
  import { get } from "../../libs/fetcher";
  import LevelIcon from "../_components/LevelIcon.svelte";
  import type { IProblemDetails } from "../../types";
  import FileLink from "../_components/FileLink.svelte";

  let id: number;
  const getProblem = () => get<IProblemDetails>("/problems/" + id);

  const problem = useQuery({
    queryFn: getProblem,
    enabled: false,
  });

  $: {
    id = Number($params.id);
    problem.setOptions({
      queryKey: ["problem", id],
      queryFn: getProblem,
    });
  }
</script>

<main>
  {#if $problem.isSuccess}
    <section>
      <h1>
        <LevelIcon levels={$problem.data.levels} small={true} />
        {$problem.data.title}
        {#if $problem.data.file}<FileLink {id} key="" float="right" />{/if}
      </h1>
      <p>{$problem.data.content}</p>
    </section>
  {/if}
</main>

<style>
  main {
    display: flex;
    align-items: center;
  }
  main,
  section {
    contain: content;
    flex-direction: column;
  }
  section {
    display: flex;
    width: 100%;
    max-width: var(--content-max-width);
  }
  h1 {
    width: 100%;
  }
  p {
    padding: 1.5em 2em;
    border: 1px solid rgba(var(--text-color), calc(var(--background-opacity) * 3));
    /* box-shadow: 0 0.0625em 0.5em rgba(var(--text-color), calc(var(--background-opacity) * 3)); */
    border-radius: 0.75em;
  }

  @media (min-width: 48em) {
  }

  @media (min-width: 64em) {
  }
</style>
