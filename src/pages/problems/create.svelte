<script lang="ts">
  import { _ } from "svelte-i18n";
  import { goto } from "@roxi/routify";
  import { useMutation, useQueryClient } from "@sveltestack/svelte-query";
  import { put } from "../../libs/fetcher";
  import { proxyStream, getLocalStorage, setLocalStorage } from "../../libs/utils";
  import BigButton from "../_components/BigButton.svelte";
  import TextInput from "../_components/TextInput.svelte";
  import TextArea from "../_components/TextArea.svelte";
  import FileUpload from "../_components/FileUpload.svelte";

  let title: string = "";
  let source: string = getLocalStorage<string>("lastSource")() ?? "";
  let license: string = getLocalStorage<string>("lastLicense")() ?? "";
  let flag: string = "";
  let content: string = "";
  let group: string = "everyone";

  let problemFile: File | null = null;
  let buildFile: File | null = null;

  let uploadedProblemFileSize = 0;
  let uploadedBuildFileSize = 0;

  const queryClient = useQueryClient();

  const setLastSource = setLocalStorage<string>("lastSource");
  const setLastLicense = setLocalStorage<string>("lastLicense");

  const upload = useMutation(
    () => put<{ id: number }>("/problems", { title, source, license, flag, content, group }),
    {
      onSuccess: async (data) => {
        const { id } = data;
        try {
          Promise.all([
            queryClient.invalidateQueries("problems"),
            setLastSource(source),
            setLastLicense(license),

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
</script>

<main>
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
    <BigButton mutation={upload}>{$_("problem.upload")}</BigButton>
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
