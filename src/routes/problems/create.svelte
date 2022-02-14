<script lang="ts">
  import { _ } from "svelte-i18n";
  import { MetaTags } from "svelte-meta-tags";
  import { goto } from "@roxi/routify";
  import { useMutation, useQueryClient } from "@sveltestack/svelte-query";
  import Editor from "@toast-ui/editor";
  import "@toast-ui/editor/dist/toastui-editor-only.css";
  import { post, put } from "../../libs/fetcher";
  import { getLocalStorage, setLocalStorage } from "../../libs/utils";
  import { themeMode } from "../../queries";
  import BigButton from "../_components/BigButton.svelte";
  import TextInput from "../_components/TextInput.svelte";
  import FileUpload from "../_components/FileUpload.svelte";
  import TagSearch from "../_components/TagSearch.svelte";

  let title: string = "";
  let source: string = getLocalStorage<string>("lastSource")() ?? "";
  let license: string = getLocalStorage<string>("lastLicense")() ?? "";
  let flag: string = "";
  let group: string = "everyone";
  let editor: Editor;
  let editorElm: HTMLDivElement;
  let tags: number[] = [];

  let problemFile: File | null = null;
  let buildFile: File | null = null;

  // let uploadedProblemFileSize = 0;
  // let uploadedBuildFileSize = 0;

  const queryClient = useQueryClient();

  const setLastSource = setLocalStorage<string>("lastSource");
  const setLastLicense = setLocalStorage<string>("lastLicense");

  const upload = useMutation(
    () =>
      post<{ id: number }>("/problems", {
        title,
        source,
        license,
        flag,
        content: editor.getMarkdown(),
        group,
      }),
    {
      onSuccess: async (data) => {
        const { id } = data;
        try {
          Promise.all([
            queryClient.invalidateQueries("problems"),
            setLastSource(source),
            setLastLicense(license),

            tags.length > 0 && put<{}>(`/problems/${id}/tags`, { tags }),
            problemFile &&
              put<{}>(
                `/problems/${id}/file`,
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
              location.href = `/problems/${id}`;
            })
            .catch(() => {
              location.href = `/problems/${id}/edit`;
            });
        } catch (e) {
          location.href = `/problems/${id}/edit`;
        }
      },
    }
  );
  $: if (editorElm != null) {
    editor = new Editor({
      el: editorElm,
      height: "540px",
      initialEditType: "markdown",
      previewStyle: "tab",
      usageStatistics: false,
      theme: $themeMode,
    });
  }
</script>

<MetaTags
  title="{$_('problem.create')} | CTF Archive"
  openGraph={{
    type: "website",
    site_name: "CTF Archive",
    url: location.toString(),
    title: `${$_("problem.create")} | CTF Archive`,
    images: [
      {
        url: "https://ctf-archive.com/assets/images/logo-800.png",
        alt: "CTF Archive Logo",
        width: 800,
        height: 800,
      },
    ],
  }}
/>

<main>
  <section>
    <TextInput type="text" bind:value={title}>{$_("problem.title")}</TextInput>
    <TextInput type="text" bind:value={source}>{$_("problem.source")}</TextInput>
    <TextInput type="text" bind:value={license}>{$_("problem.license")}</TextInput>
    <TextInput type="text" bind:value={flag} monospace={true}>{$_("problem.flag")}</TextInput>
    <TextInput type="text" bind:value={group}>{$_("problem.group")}</TextInput>
    <div bind:this={editorElm} class="description" />
    <TagSearch bind:tags />
    <FileUpload bind:file={problemFile} accepts={[".7z"]}>{$_("problem.problemFile")}</FileUpload>
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
  .description {
    margin: 1em 0;
  }

  @media (min-width: 48em) {
  }

  @media (min-width: 64em) {
  }
</style>
