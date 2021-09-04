<script lang="ts">
  import { params } from "@roxi/routify";
  import { useMutation, useQuery, useQueryClient } from "@sveltestack/svelte-query";
  import { get, post, put } from "../../libs/fetcher";
  import { charsets, escapeAllow, getLocalStorage, markdown } from "../../libs/utils";
  import Link from "../_components/Link.svelte";
  import FileLink from "../_components/FileLink.svelte";
  import TextArea from "../_components/TextArea.svelte";
  import BigButton from "../_components/BigButton.svelte";
  import BigLinkButton from "../_components/BigLinkButton.svelte";
  import TextInput from "../_components/TextInput.svelte";
  import ColorList from "../_components/ColorList.svelte";
  import LevelIcon from "../_components/LevelIcon.svelte";
  import SubmissionCircle from "../_components/SubmissionCircle.svelte";
  import { Levels, ProblemType, UserAuth } from "../../types";
  import type { IProblemDetails, IUserPrivateInfo, IStatus } from "../../types";
  import ProblemEditLink from "../_components/ProblemEditLink.svelte";

  let id: number;
  let lifetime: string = "30";
  let loggedIn = false;
  let flag: string = "";
  let levels: Levels = [0, 0, 0, 0, 0, 0];
  let comment: string = "";

  const getMyInfo = () => get<IUserPrivateInfo>("/users/-");
  const getProblem = () => get<IProblemDetails>("/problems/" + id);
  const getStatus = () => get<IStatus>("/problems/status");
  const startServer = () => post<{}>(`/problems/${id}/start`, { lifetime: Number(lifetime) });
  const stopServer = () => post<{}>(`/problems/${id}/stop`, {});
  const submit = () =>
    put<{}>(`/problems/${id}/submissions`, {
      flag,
      levels: levels.map((level) => Math.min(30, Math.max(0, Number(level) || 0))),
      comment,
    });
  const edit = () =>
    post<{}>(`/problems/${id}/submissions`, {
      levels: levels.map((level) => Math.min(30, Math.max(0, Number(level) || 0))),
      comment,
    });

  const queryClient = useQueryClient();

  const sessionid = useQuery("sessionid", getLocalStorage<string>("sessionid"), {
    cacheTime: 0,
    staleTime: 0,
  });

  const status = useQuery({
    queryFn: getStatus,
    enabled: false,
  });

  const problem = useQuery({
    queryFn: getProblem,
    enabled: false,
  });

  const me = useQuery({
    queryFn: getMyInfo,
    enabled: false,
  });

  const startMutation = useMutation(startServer, {
    onSuccess: () => {
      queryClient.invalidateQueries("status");
    },
    onError: () => {
      queryClient.invalidateQueries("status");
    },
  });
  const stopMutation = useMutation(stopServer, {
    onSuccess: () => {
      queryClient.invalidateQueries("status");
    },
    onError: () => {
      queryClient.invalidateQueries("status");
    },
  });
  const submitMutation = useMutation(submit, {
    onSuccess: () => {
      queryClient.invalidateQueries("me");
      if ($me.isSuccess) queryClient.invalidateQueries(["users", $me.data.username]);
      queryClient.invalidateQueries("problems");
      queryClient.invalidateQueries(["problem", id]);
    },
  });
  const editMutation = useMutation(edit, {
    onSuccess: () => {
      queryClient.invalidateQueries("me");
      if ($me.isSuccess) queryClient.invalidateQueries(["users", $me.data.username]);
      queryClient.invalidateQueries("problems");
      queryClient.invalidateQueries(["problem", id]);
    },
  });

  $: {
    id = Number($params.id);
    problem.setOptions({
      queryKey: ["problem", id],
      queryFn: getProblem,
    });
  }
  $: {
    if ((loggedIn = $sessionid.data != null)) {
      status.setOptions({
        queryKey: "status",
        queryFn: getStatus,
      });
      me.setOptions({
        queryKey: "me",
        queryFn: getMyInfo,
        retry: false,
      });
    }
  }

  /*
  escapeAllow(
    $problem.data.title.replace(new RegExp(`[${charsets.special}]`, "g"), "_"),
    charsets.alphanumeric
  )
  */
</script>

<main>
  {#if $problem.isSuccess}
    <section>
      <h1>
        <LevelIcon levels={$problem.data.levels} small={true} />
        <span>{$problem.data.title}</span>
        {#if $problem.data.types & ProblemType.ProblemFileExist}
          <FileLink {id} key={$problem.data.uuid} name={$problem.data.title} float="right" />
        {/if}
        {#if loggedIn && me !== null && $me.isSuccess && $me.data.auth >= UserAuth.Admin}
          <ProblemEditLink {id} float="right" />
        {/if}
      </h1>
      <p class="markdown">{@html markdown($problem.data.content)}</p>
    </section>
    <section>
      {#if $problem.data.types & ProblemType.BuildFileExist && $status.isSuccess}
        <div class="warning">
          서버가 켜지는 데 오래 걸릴 수 있습니다. 로딩이 1분 이상 지속되거나, 서버에 접속이 되지
          않더라도 2~3분 정도 대기해 주시기 바랍니다.
        </div>
        {#if $status.data.id !== id}
          <TextInput type="number" bind:value={lifetime}>켜둘 시간 (분)</TextInput>
          <BigButton mutation={startMutation} disabled={$status.data.remain <= 0}
            >서버 시작하기</BigButton
          >
        {:else}
          <div class="address">
            서버 주소: <pre>35.212.179.177:{$status.data.port}</pre>
          </div>
          <BigButton mutation={stopMutation}>서버 종료하기</BigButton>
        {/if}
      {:else}
        <div class="warning">
          서버가 필요한 문제입니다.&nbsp;<Link href="/login">로그인</Link>하여 서버를 사용할 수
          있습니다.
        </div>
      {/if}
    </section>
    <section>
      <TextInput bind:value={flag}>플래그</TextInput>
      <div>
        <SubmissionCircle bind:levels />
        <TextArea rows={8} bind:value={comment}>댓글</TextArea>
      </div>
      <ColorList />
      {#if $sessionid.data != null}
        <BigButton mutation={submitMutation}>제출</BigButton>
      {:else}
        <BigLinkButton href="/login">로그인 필요</BigLinkButton>
      {/if}
    </section>
  {/if}
</main>

<style>
  main {
    display: flex;
    align-items: center;
    padding: 1rem 1rem;
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
    padding: 1.5em 2em;
    border: 1px solid rgba(var(--text-color), calc(var(--background-opacity) * 3));
    border-radius: 0.75em;
    margin: 1em 0;
    /* box-shadow: 0 0.0625em 0.5em rgba(var(--text-color), calc(var(--background-opacity) * 2)); */
  }
  h1 {
    width: 100%;
  }
  span {
    margin-left: 0.5em;
  }
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 1em 0;
  }
  p {
    word-break: break-all;
    white-space: pre-wrap;
  }
  .warning {
    font-size: 0.875em;
    background: rgba(var(--link-color), calc(var(--background-opacity) * 1.85));
    padding: 1em 2em;
    border-radius: 0.25em;
  }
  .address {
    text-align: center;
  }
  pre {
    font-size: 1.25em;
    background: rgba(var(--text-color), calc(var(--background-opacity) * 2));
    padding: 0.5em 1.5em;
    border-radius: 0.25em;
    margin: 0;
    margin-left: 1em;
  }

  @media (min-width: 48em) {
  }

  @media (min-width: 64em) {
    div {
      flex-direction: row;
    }
  }
</style>
