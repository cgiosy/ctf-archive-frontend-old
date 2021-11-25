<script lang="ts">
  import { _ } from "svelte-i18n";
  import { params } from "@roxi/routify";
  import { useMutation, useQueryClient } from "@sveltestack/svelte-query";
  import { post, put } from "../../libs/fetcher";
  import { copyToClipboard, markdown } from "../../libs/utils";
  import Link from "../_components/Link.svelte";
  import ProblemEditLink from "../_components/ProblemEditLink.svelte";
  import ProblemLicenseLink from "../_components/ProblemLicenseLink.svelte";
  import Notice from "../_components/Notice.svelte";
  import LevelIcon from "../_components/LevelIcon.svelte";
  import ColorList from "../_components/ColorList.svelte";
  import FileLink from "../_components/FileLink.svelte";
  import TextArea from "../_components/TextArea.svelte";
  import BigButton from "../_components/BigButton.svelte";
  import BigLinkButton from "../_components/BigLinkButton.svelte";
  import IconButton from "../_components/IconButton.svelte";
  import IconLinkButton from "../_components/IconLinkButton.svelte";
  import Tag from "../_components/Tag.svelte";
  import TextInput from "../_components/TextInput.svelte";
  import TagSearch from "../_components/TagSearch.svelte";
  import SubmissionCircle from "../_components/SubmissionCircle.svelte";
  import Submissions from "../_components/Submissions.svelte";
  import { Levels, ProblemType, UserAuth } from "../../types";
  import { useMyInfo, useProblem, useSessionid, useStatus } from "../../queries";

  let id: number;
  let lifetime: string = "30";
  let loggedIn = false;
  let flag: string = "";
  let levels: Levels = [0, 0, 0, 0, 0, 0];
  let tags: number[] = [];
  let showTags: boolean = false;
  let comment: string = "";
  let isInvalidLevels: boolean = true;
  let isModifiedTags: boolean = false;

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
  const editTags = () => put<{}>(`/problems/${id}/tags`, { tags });

  const queryClient = useQueryClient();

  const [sessionid] = useSessionid();
  const [status, getStatus, statusKey] = useStatus();
  const [problem, getProblem, problemKey] = useProblem();
  const [me, getMyInfo, myInfoKey] = useMyInfo();

  const reloadStatus = () => {
    queryClient.invalidateQueries(statusKey());
  };
  const reloadUserAndProblem = () => {
    if ($me.isSuccess) queryClient.invalidateQueries(["user", $me.data.username]);
    queryClient.invalidateQueries(myInfoKey());
    queryClient.invalidateQueries("problems");
    queryClient.invalidateQueries(problemKey());
  };

  const startMutation = useMutation(startServer, {
    onSuccess: reloadStatus,
    onError: reloadStatus,
  });
  const stopMutation = useMutation(stopServer, {
    onSuccess: reloadStatus,
    onError: reloadStatus,
  });
  const submitMutation = useMutation(submit, {
    onSuccess: ({ correct }) => {
      if (correct === false) throw new Error("WRONG_ANSWER");
      reloadUserAndProblem();
    },
  });
  const editMutation = useMutation(edit, {
    onSuccess: reloadUserAndProblem,
  });
  const editTagsMutation = useMutation(editTags, {
    onSuccess: reloadUserAndProblem,
  });
  const mergeTags = (newTags: number[]) => (isModifiedTags ? tags : newTags);

  $: isInvalidLevels = !(
    levels.every((x) => 0 <= x && x <= 30 && Number.isInteger(x)) && levels.some((x) => x > 0)
  );
  $: getProblem((id = Number($params.id)));
  $: if ($problem.isSuccess && $problem.data.submission != null) {
    if (isInvalidLevels) {
      isInvalidLevels = false;
      levels = $problem.data.submission.levels;
    }
    if (comment === "") comment = $problem.data.submission.comment;
  }
  $: if ((loggedIn = !!$sessionid.data)) getMyInfo();
  $: if (loggedIn && $problem.isSuccess) {
    tags = mergeTags($problem.data.tags);
    if ($problem.data.types & ProblemType.BuildFileExist) getStatus();
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
        <span class="title">{$problem.data.title}</span>
        {#if $problem.data.license}
          <ProblemLicenseLink url={$problem.data.license} float="right" />
        {/if}
        {#if loggedIn && me !== null && $me.isSuccess && $me.data.auth >= UserAuth.Admin}
          <ProblemEditLink {id} float="right" />
        {/if}
      </h1>
      <div class="tags-small">
        {#if showTags || $problem.data.types & ProblemType.Solved}
          {#each $problem.data.tags as tid, i}
            {i ? " | " : ""}
            <Tag {tid} />
          {/each}
          {#if $problem.data.tags.length === 0}
            ?
          {/if}
        {:else}
          <span
            class="showTags"
            on:click={() => {
              showTags = true;
            }}>...</span
          >
        {/if}
      </div>
      <p class="markdown">{@html markdown($problem.data.content)}</p>
    </section>
    <section>
      {#if $problem.data.types & ProblemType.BuildFileExist}
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
              <pre>35.212.240.188:{$status.data.port}</pre>
              <IconButton onClick={() => copyToClipboard("nc 35.212.240.188 " + $status.data?.port)}
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
              <IconLinkButton href="http://35.212.240.188:{$status.data.port}" target="_blank"
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
      {/if}
      {#if $problem.data.types & ProblemType.ProblemFileExist}
        <BigLinkButton href={`//cdn.ctf-archive.com/ctf/${id}-${$problem.data.uuid}.7z`}
          >{$_("problem.download")}</BigLinkButton
        >
      {/if}
    </section>
    <section>
      {#if !($problem.data.types & ProblemType.Solved)}
        <TextInput bind:value={flag} monospace={true}>{$_("problem.flag")}</TextInput>
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
    {#if $problem.data.types & ProblemType.Solved}
      <section class="tags">
        <TagSearch bind:tags bind:modified={isModifiedTags} />
        <BigButton mutation={editTagsMutation}>{$_("problem.editTags")}</BigButton>
      </section>
      <Submissions {id} />
    {/if}
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
    margin-top: 0;
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
  .title {
    vertical-align: baseline;
  }
  .showTags {
    cursor: pointer;
  }
  .markdown {
    margin: 0.75em 0 -2.5em 0;
    padding: 1.25em 0;
    border-top: 1px solid rgba(var(--text-color), calc(var(--background-opacity) * 3));
    line-height: 187.5%;
    word-break: break-all;
    white-space: pre-wrap;
  }
  .markdown :global(p) {
    margin: 0;
  }
  .markdown :global(img) {
    background: white;
  }
  .tags-small::before {
    content: "# ";
  }
  .tags-small {
    display: block;
    margin: -2.125em 0 0.75em 5.375em;
    min-height: 1em;
    padding: 0 1.5em;
    font-size: 0.825em;
    font-family: var(--font-family-monospace);
  }
  .tags {
    display: flex;
    font-size: 0.875em;
    contain: unset;
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
