<script lang="ts">
  import { _ } from "svelte-i18n";
  import { goto, params } from "@roxi/routify";
  import { useMutation, useQueryClient } from "@sveltestack/svelte-query";
  import { del, put, post } from "../../../libs/fetcher";
  // import { proxyStream } from "../../../libs/utils";
  import BigButton from "../../_components/BigButton.svelte";
  import TextInput from "../../_components/TextInput.svelte";
  import TextArea from "../../_components/TextArea.svelte";
  import FileUpload from "../../_components/FileUpload.svelte";
  import { useProblemDetails } from "../../../queries";
  import type { IProblemDetails } from "../../../types";

  let id: number;
  let title: string = "";
  let source: string = "";
  let license: string = "";
  let flag: string = "";
  let content: string = "";
  let group: string = "everyone";

  let problemFile: File | null = null;
  let buildFile: File | null = null;

  // let uploadedProblemFileSize = 0;
  // let uploadedBuildFileSize = 0;

  let step = 0;
  let removeId = "";

  const queryClient = useQueryClient();
  const [problem, getProblem, problemKey] = useProblemDetails();

  const edit = useMutation(
    () => post<{}>("/problems/" + id, { title, source, license, flag, content, group }),
    {
      onSuccess: async (data) => {
        try {
          Promise.all([
            queryClient.invalidateQueries(problemKey()),
            problemFile &&
              put<{}>(
                `/problems/${id}/files`,
                problemFile
                /*
              proxyStream<any>(problemFile.stream(), ({ done, value }) => {
                if (done) uploadedProblemFileSize = Infinity;
                else uploadedProblemFileSize += value.length;
              })
              */
              ),
            buildFile &&
              put<{}>(
                `/problems/${id}/buildfile`,
                buildFile
                /*
              proxyStream<any>(buildFile.stream(), ({ done, value }) => {
                if (done) uploadedBuildFileSize = Infinity;
                else uploadedBuildFileSize += value.length;
              })
              */
              ),
          ])
            .then(() => {
              $goto(`/problems/${id}`);
            })
            .catch(() => {
              $goto(`/problems/${id}/edit`);
            });
        } catch (e) {
          $goto(`/problems/${id}/edit`);
        }
      },
    }
  );

  const remove = useMutation(
    () => {
      if (id !== Number(removeId)) throw new Error("올바르지 않은 값입니다!");
      return del<{}>(`/problems/${id}`);
    },
    {
      onSuccess: async () => {
        Promise.all([queryClient.invalidateQueries("problems")]).then(() => {
          $goto(`/`);
        });
      },
    }
  );

  const setData = (data: IProblemDetails) => {
    title = data.title;
    source = data.source;
    license = data.license;
    content = data.content;
    group = data.group;
    flag = data.flag ?? "";
  };

  const next = useMutation(async () => {
    step = 1;
  });

  $: getProblem((id = Number($params.id)));
  $: if ($problem.isSuccess) setData($problem.data);
</script>

<main>
  {#if $problem.isSuccess}
    <section>
      <TextInput type="text" bind:value={title}>{$_("problem.title")}</TextInput>
      <TextInput type="text" bind:value={source}>{$_("problem.source")}</TextInput>
      <TextInput type="text" bind:value={license}>{$_("problem.license")}</TextInput>
      <TextInput type="text" bind:value={flag} monospace={true}>{$_("problem.flag")}</TextInput>
      <TextInput type="text" bind:value={group}>{$_("problem.group")}</TextInput>
      <TextArea bind:value={content} rows={15}>{$_("problem.description")}</TextArea>
      <FileUpload bind:file={problemFile} accepts={[".zip", ".7z"]}
        >{$_("problem.problemFile")}</FileUpload
      >
      <FileUpload bind:file={buildFile} accepts={[".7z"]}>{$_("problem.buildFile")}</FileUpload>
      <BigButton mutation={edit}>{$_("problem.edit")}</BigButton>
      {#if step === 0}
        <BigButton mutation={next}>{$_("problem.delete")}</BigButton>
      {:else}
        <TextInput type="string" bind:value={removeId} monospace={true}
          >{$_("problem.inputProblemId")}</TextInput
        >
        <BigButton mutation={remove}>{$_("problem.delete")}</BigButton>
      {/if}
    </section>
  {/if}
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
