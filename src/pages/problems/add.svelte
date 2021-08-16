<script lang="ts">
  import { goto } from "@roxi/routify";
  import { useMutation, useQueryClient } from "@sveltestack/svelte-query";
  import { put } from "../../libs/fetcher";
  import BigButton from "../_components/BigButton.svelte";
  import TextInput from "../_components/TextInput.svelte";
  import TextArea from "../_components/TextArea.svelte";

  let title: string = "";
  let source: string = "";
  let flag: string = "";
  let content: string = "";
  let group: string = "everyone";

  const queryClient = useQueryClient();

  const upload = useMutation(
    () => put<{ id: number }>("/problems", { title, source, flag, content, group }),
    {
      onSuccess: async (data) => {
        const { id } = data;
        queryClient.invalidateQueries("problems").then(() => {
          $goto(`/problems/${id}`);
        });
      },
    }
  );
</script>

<main>
  <section>
    <TextInput type="text" bind:value={title}>제목</TextInput>
    <TextInput type="text" bind:value={source}>출처</TextInput>
    <TextInput type="text" bind:value={flag} monospace={true}>플래그 (정규식 지원)</TextInput>
    <TextArea bind:value={content} rows={15}>디스크립션</TextArea>
    <!-- File Upload -->
    <BigButton mutation={upload}>업로드</BigButton>
  </section>
</main>

<style>
  main {
    display: flex;
    align-items: center;
    padding: 2em 0;
  }
  main,
  section {
    contain: content;
    flex-direction: column;
  }
  section {
    display: flex;
    width: 100%;
    max-width: calc(var(--content-max-width) / 5 * 3);
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
