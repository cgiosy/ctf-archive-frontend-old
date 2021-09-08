<script lang="ts">
  import { _ } from "svelte-i18n";
  import { params } from "@roxi/routify";
  import { useMutation, useQuery, useQueryClient } from "@sveltestack/svelte-query";
  import { get, post, put } from "../../libs/fetcher";
  import {
    charsets,
    copyToClipboard,
    escapeAllow,
    getLocalStorage,
    markdown,
  } from "../../libs/utils";
  import Link from "../_components/Link.svelte";
  import ProblemEditLink from "../_components/ProblemEditLink.svelte";
  import Notice from "../_components/Notice.svelte";
  import LevelIcon from "../_components/LevelIcon.svelte";
  import ColorList from "../_components/ColorList.svelte";
  import FileLink from "../_components/FileLink.svelte";
  import TextArea from "../_components/TextArea.svelte";
  import BigButton from "../_components/BigButton.svelte";
  import BigLinkButton from "../_components/BigLinkButton.svelte";
  import IconButton from "../_components/IconButton.svelte";
  import IconLinkButton from "../_components/IconLinkButton.svelte";
  import TextInput from "../_components/TextInput.svelte";
  import SubmissionCircle from "../_components/SubmissionCircle.svelte";
  import { Levels, ProblemType, UserAuth } from "../../types";
  import type { IProblemDetails, IUserPrivateInfo, IStatus } from "../../types";

  let id: number;
  let lifetime: string = "30";
  let loggedIn = false;
  let flag: string = "";
  let levels: Levels = [0, 0, 0, 0, 0, 0];
  let comment: string = "";
  let isInvalidLevels: boolean = true;

  const getMyInfo = () => get<IUserPrivateInfo>("/users/-");
  const getProblem = () => get<IProblemDetails>("/problems/" + id);
  const getStatus = () => get<IStatus>("/problems/status");
  const startServer = () => post<{}>(`/problems/${id}/start`, { lifetime: Number(lifetime) });
  const stopServer = () => post<{}>(`/problems/${id}/stop`, {});
  const submit = () =>
    put<{ correct: boolean; time: string }>(`/problems/${id}/submissions`, {
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
    onSuccess: ({ correct }) => {
      if (correct === false) throw new Error("WRONG_ANSWER");
      if ($me.isSuccess) queryClient.invalidateQueries(["users", $me.data.username]);
      queryClient.invalidateQueries("me");
      queryClient.invalidateQueries("problems");
      queryClient.invalidateQueries(["problem", id]);
    },
  });
  const editMutation = useMutation(edit, {
    onSuccess: () => {
      if ($me.isSuccess) queryClient.invalidateQueries(["users", $me.data.username]);
      queryClient.invalidateQueries("me");
      queryClient.invalidateQueries("problems");
      queryClient.invalidateQueries(["problem", id]);
    },
  });

  $: isInvalidLevels = !(
    levels.every((x) => 0 <= x && x <= 30 && Number.isInteger(x)) && levels.some((x) => x > 0)
  );
  $: {
    id = Number($params.id);
    problem.setOptions({
      queryKey: ["problem", id],
      queryFn: getProblem,
      onSuccess: (data) => {
        if (data.submission != null) {
          if (isInvalidLevels) {
            isInvalidLevels = false;
            levels = data.submission.levels;
          }
          if (comment === "") comment = data.submission.comment;
        }
      },
    });
  }
  $: {
    if ((loggedIn = $sessionid.data != null)) {
      me.setOptions({
        queryKey: "me",
        queryFn: getMyInfo,
        retry: false,
      });
    }
  }
  $: {
    if (loggedIn && $problem.isSuccess && $problem.data.types & ProblemType.BuildFileExist) {
      status.setOptions({
        queryKey: "status",
        queryFn: getStatus,
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
    {#if $problem.data.types & ProblemType.BuildFileExist}
      <section>
        {#if $status.isSuccess}
          <Notice>{$_("server.notice")}</Notice>
          {#if $status.data.id !== id}
            <TextInput type="number" bind:value={lifetime}>{$_("server.lifetime")}</TextInput>
            <BigButton mutation={startMutation} disabled={$status.data.remain <= 0}
              >{$_("server.start")}</BigButton
            >
          {:else}
            <div class="address">
              {$_("server.address")}:
              <pre>35.212.179.177:{$status.data.port}</pre>
              <IconButton onClick={() => copyToClipboard("35.212.179.177:" + $status.data?.port)}
                ><svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  style="fill: rgb(var(--text-color))"
                  ><path d="M0 0h24v24H0V0z" fill="none" /><path
                    d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
                  /></svg
                ></IconButton
              >
              <IconLinkButton href="http://35.212.179.177:{$status.data.port}"
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  enable-background="new 0 0 24 24"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  fill="#000000"
                  ><rect fill="none" height="24" width="24" /><path
                    d="M15,5l-1.41,1.41L18.17,11H2V13h16.17l-4.59,4.59L15,19l7-7L15,5z"
                  /></svg
                ></IconLinkButton
              >
            </div>
            <BigButton mutation={stopMutation}>{$_("server.stop")}</BigButton>
          {/if}
        {:else}
          <Notice>
            {$_("server.required")}&nbsp;<Link href="/login">{$_("auth.login")}</Link>{$_(
              "server.login"
            )}
          </Notice>
        {/if}
      </section>
    {/if}
    <section>
      {#if !($problem.data.types & ProblemType.Solved)}
        <TextInput bind:value={flag}>{$_("problem.flag")}</TextInput>
      {/if}
      <div>
        <SubmissionCircle bind:levels />
        <TextArea rows={8} bind:value={comment}>{$_("problem.comment")}</TextArea>
      </div>
      <ColorList />
      {#if $sessionid.data != null}
        {#if $problem.data.types & ProblemType.Solved}
          <BigButton mutation={editMutation} hidden={isInvalidLevels}
            >{$_("problem.submit")}</BigButton
          >
        {:else}
          <BigButton mutation={submitMutation} hidden={isInvalidLevels}
            >{$_("problem.submit")}</BigButton
          >
        {/if}
        {#if isInvalidLevels}
          <Notice>
            {$_("problem.levelsRequired")}
          </Notice>
        {/if}
      {:else}
        <BigLinkButton href="/login">{$_("auth.required")}</BigLinkButton>
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
  .address {
    text-align: center;
  }
  pre {
    font-size: 1.25em;
    background: rgba(var(--text-color), calc(var(--background-opacity) * 2));
    padding: 0.5em 1.5em;
    border-radius: 0.25em;
    margin: 0 1em;
  }

  @media (min-width: 48em) {
  }

  @media (min-width: 64em) {
    div {
      flex-direction: row;
    }
  }
</style>
