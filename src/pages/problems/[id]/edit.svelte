<script lang="ts">
  import { goto, params } from "@roxi/routify";
  import { useMutation, useQuery, useQueryClient } from "@sveltestack/svelte-query";
  import { get, del, put, post } from "../../../libs/fetcher";
  import { proxyStream } from "../../../libs/utils";
  import BigButton from "../../_components/BigButton.svelte";
  import TextInput from "../../_components/TextInput.svelte";
  import TextArea from "../../_components/TextArea.svelte";
  import FileUpload from "../../_components/FileUpload.svelte";
  import type { IProblemDetails } from "../../../types";

  let id: number;
  let title: string = "";
  let source: string = "";
  let flag: string = "";
  let content: string = "";
  let group: string = "everyone";

  let problemFile: File | null = null;
  let buildFile: File | null = null;

  let uploadedProblemFileSize = 0;
  let uploadedBuildFileSize = 0;

  let step = 0;
  let removeId = "";

  const getProblem = () => get<IProblemDetails>("/problems/" + id);

  const queryClient = useQueryClient();

  const problem = useQuery({
    queryFn: getProblem,
    enabled: false,
  });

  const edit = useMutation(
    () => post<{}>("/problems/" + id, { title, source, flag, content, group }),
    {
      onSuccess: async (data) => {
        Promise.all([
          queryClient.invalidateQueries(["problem", id]),
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
        ]).then(() => {
          $goto(`/problems/${id}`);
        });
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

  const next = useMutation(async () => {
    step = 1;
  });

  $: {
    id = Number($params.id);
    problem.setOptions({
      queryKey: ["problemEdit", id],
      queryFn: getProblem,
      onSuccess: (data) => {
        title = data.title;
        source = data.source;
        content = data.content;
        // group = "everyone";
      },
      cacheTime: 0,
      staleTime: 0,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    });
  }
</script>

<main>
  {#if $problem.isSuccess}
    <section>
      <TextInput type="text" bind:value={title}>제목</TextInput>
      <TextInput type="text" bind:value={source}>출처</TextInput>
      <TextInput type="text" bind:value={flag} monospace={true}>플래그</TextInput>
      <TextInput type="text" bind:value={group}>공개할 그룹</TextInput>
      <TextArea bind:value={content} rows={15}>디스크립션</TextArea>
      <FileUpload bind:file={problemFile}>문제 파일 (zip or 7z / 드래그 앤 드롭 가능)</FileUpload>
      <FileUpload bind:file={buildFile}>빌드 파일 (zip or 7z / 드래그 앤 드롭 가능)</FileUpload>
      <BigButton mutation={edit}>변경</BigButton>
      {#if step === 0}
        <BigButton mutation={next}>삭제</BigButton>
      {:else}
        <TextInput type="string" bind:value={removeId} monospace={true}
          >문제 번호를 입력해 주세요!</TextInput
        >
        <BigButton mutation={remove}>삭제</BigButton>
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
