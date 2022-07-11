<script lang="ts">
  import { _ } from "svelte-i18n";
  import { MetaTags } from "svelte-meta-tags";
  import { params } from "@roxi/routify";
  import { useMutation, useQueryClient } from "@sveltestack/svelte-query";
  import Viewer from "@toast-ui/editor/dist/toastui-editor-viewer";
  import "@toast-ui/editor/dist/toastui-editor-viewer.css";
  import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
  import { themeMode, useMyInfo, useProblem, useSessionid, useStatus } from "../../../queries";
  import { post, put } from "../../../libs/fetcher";
  import { copyToClipboard, formatTime } from "../../../libs/utils";
  import Link from "../../_components/Link.svelte";
  import ProblemEditLink from "../../_components/ProblemEditLink.svelte";
  import ProblemLicenseLink from "../../_components/ProblemLicenseLink.svelte";
  import Notice from "../../_components/Notice.svelte";
  import LevelIcon from "../../_components/LevelIcon.svelte";
  import ColorList from "../../_components/ColorList.svelte";
  import TextArea from "../../_components/TextArea.svelte";
  import BigButton from "../../_components/BigButton.svelte";
  import BigLinkButton from "../../_components/BigLinkButton.svelte";
  import IconButton from "../../_components/IconButton.svelte";
  import IconLinkButton from "../../_components/IconLinkButton.svelte";
  import Tooltip from "../../_components/Tooltip.svelte";
  import Tag from "../../_components/Tag.svelte";
  import TextInput from "../../_components/TextInput.svelte";
  import TagSearch from "../../_components/TagSearch.svelte";
  import SubmissionCircle from "../../_components/SubmissionCircle.svelte";
  import Submissions from "../../_components/Submissions.svelte";
  import { ProblemType, UserAuth } from "../../../types";
  import type { Levels } from "../../../types";

  let id: number;
  let lifetime: string = "30";
  let signedIn = false;
  let flag: string = "";
  let levels: Levels = [0, 0, 0, 0, 0, 0];
  let tags: number[] = [];
  let showTags: boolean = false;
  let comment: string = "";
  let isInvalidLevels: boolean = true;
  let isModifiedTags: boolean = false;
  let used: number = 0;
  let viewer: Viewer;
  let viewerElm: HTMLParagraphElement;

  const startServer = () => post<{}>(`/problems/${id}/start`, { lifetime: Number(lifetime) });
  const stopServer = () => post<{}>(`/problems/${id}/stop`, {});
  const submit = () =>
    post<{ correct: boolean; time: string }>(`/problems/${id}/submissions`, {
      flag,
      levels: levels.map((level) => Math.min(30, Math.max(0, Number(level) || 0))),
      comment,
    });
  const edit = () =>
    put<{}>(`/problems/${id}/submissions`, {
      levels: levels.map((level) => Math.min(30, Math.max(0, Number(level) || 0))),
      comment,
    });
  const editTags = () => put<{}>(`/problems/${id}/tags`, { tags });

  const queryClient = useQueryClient();

  const [sessionid] = useSessionid();
  const [status, getStatus, statusKey] = useStatus();
  const [problem, getProblem, problemKey] = useProblem();
  const [me, getMyInfo, myInfoKey] = useMyInfo();

  let isSolved = false;
  let isAdmin = false;

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

  $: isSolved = $problem.isSuccess && ($problem.data.types & ProblemType.Solved) !== 0;
  $: isAdmin = signedIn && me !== null && $me.isSuccess && $me.data.auth >= UserAuth.Admin;
  $: isInvalidLevels = !(
    levels.every((x) => 0 <= x && x <= 30 && Number.isInteger(x)) && levels.some((x) => x > 0)
  );
  $: if (!isNaN(Number($params.id))) getProblem((id = Number($params.id)));
  $: if ($problem.isSuccess && $problem.data.submission != null) {
    if (isInvalidLevels) {
      isInvalidLevels = false;
      levels = $problem.data.submission.levels;
    }
    if (comment === "") comment = $problem.data.submission.comment;
  }
  $: if ((signedIn = !!$sessionid.data)) getMyInfo();
  $: if (signedIn && $problem.isSuccess) {
    tags = mergeTags($problem.data.tags);
    if ($problem.data.types & ProblemType.BuildFileExist) getStatus();
  }
  $: if (viewerElm != null && $problem.isSuccess) {
    viewer = new Viewer({
      el: viewerElm,
      // @ts-ignore
      height: "auto",
      initialValue: $problem.data.content,
      usageStatistics: false,
      theme: $themeMode,
    });
  }
  $: if ($status.isSuccess) used = $status.data.used;

  setInterval(() => {
    used += 1;
  }, 1000);

  /*
  escapeAllow(
    $problem.data.title.replace(new RegExp(`[${charsets.special}]`, "g"), "_"),
    charsets.alphanumeric
  )
  */
</script>

{#if $problem.isSuccess}
  <MetaTags
    title="{$problem.data.title} <{$problem.data.source}> | CTF Archive"
    description={$problem.data.content}
    openGraph={{
      type: "website",
      site_name: "CTF Archive",
      url: location.toString(),
      title: $problem.data.title,
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
{/if}

<main>
  {#if $problem.isSuccess}
    <section>
      <h1>
        <LevelIcon url={`/problems/${id}`} levels={$problem.data.levels} small={true} />
        <span class="title">{$problem.data.title}</span>
        {#if $problem.data.license}
          <ProblemLicenseLink url={$problem.data.license} float="right" />
        {/if}
        {#if isAdmin}
          <ProblemEditLink {id} float="right" />
        {/if}
      </h1>
      <div class="tags-small">
        {#if showTags || isSolved}
          {#each $problem.data.tags as tid, i (tid)}
            {i ? " | " : ""}
            <Tag {tid} />
          {/each}
          {#if $problem.data.tags.length === 0}
            No Tags.
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
      <p bind:this={viewerElm} class="description" />
    </section>
    {#if $problem.data.types & (ProblemType.BuildFileExist | ProblemType.ProblemFileExist)}
      <section>
        {#if $problem.data.types & ProblemType.BuildFileExist}
          {#if $status.isSuccess}
            <Notice>{$_("server.notice")}</Notice>
            {#if $status.data.id !== id || $status.data.status === "opening"}
              <TextInput type="number" bind:value={lifetime}>{$_("server.lifetime")}</TextInput>
              <BigButton
                mutation={startMutation}
                disabled={$status.data.remain <= 0}
                loading={$status.data.status === "opening"}>{$_("server.start")}</BigButton
              >
            {:else}
              <div class="address">
                {$_("server.address")}:
                <pre>35.212.240.188:{$status.data.port}</pre>
                <div>
                  <Tooltip text={$_("server.copyServer")}>
                    <IconButton
                      onClick={() => copyToClipboard("nc 35.212.240.188 " + $status.data?.port)}
                      ><svg width="1em" height="1em" viewBox="0 0 24 24"
                        ><path d="M0 0h24v24H0V0z" fill="none" /><path
                          d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
                        /></svg
                      ></IconButton
                    >
                  </Tooltip>
                  <Tooltip text={$_("server.openServer")}>
                    <IconLinkButton
                      href="http://35.212.240.188:{$status.data.port}"
                      target="_blank"
                      rel="noreferer nofollow"
                      ><svg
                        xmlns="http://www.w3.org/2000/svg"
                        enable-background="new 0 0 24 24"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        ><rect fill="none" height="24" width="24" /><path
                          d="M15,5l-1.41,1.41L18.17,11H2V13h16.17l-4.59,4.59L15,19l7-7L15,5z"
                        /></svg
                      ></IconLinkButton
                    >
                  </Tooltip>
                </div>
              </div>
              <time>{formatTime(used)}</time>
              <BigButton mutation={stopMutation} loading={$status.data.status === "closing"}
                >{$_("server.stop")}</BigButton
              >
            {/if}
          {:else}
            <Notice>
              {$_("server.required")}&nbsp;<Link href="/signin">{$_("auth.signin")}</Link>{$_(
                "server.signin"
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
    {/if}
    {#if isSolved || isAdmin}
      <section class="tags">
        <TagSearch bind:tags bind:modified={isModifiedTags} />
        <BigButton mutation={editTagsMutation}>{$_("problem.editTags")}</BigButton>
      </section>
    {/if}
    <section>
      {#if !isSolved}
        <TextInput bind:value={flag} monospace={true}>{$_("problem.flag")}</TextInput>
      {/if}
      <div>
        <SubmissionCircle bind:levels />
        <TextArea rows={8} bind:value={comment}>{$_("problem.comment")}</TextArea>
      </div>
      <ColorList />
      {#if $sessionid.data != null}
        {#if isSolved}
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
        <BigLinkButton href="/signin">{$_("auth.required")}</BigLinkButton>
      {/if}
    </section>
    {#if isSolved || isAdmin}
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
  svg {
    fill: rgb(var(--text-color));
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
  .description {
    margin: 0.75em 0 -0.75em 0;
    padding: 1.25em 0;
    border-top: 1px solid rgba(var(--text-color), calc(var(--background-opacity) * 3));
  }
  .description :global(img) {
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
    font-family: var(--monospace);
  }
  .tags {
    display: flex;
    font-size: 0.875em;
    contain: unset;
  }
  .address {
    text-align: center;
  }
  .address > div {
    flex-direction: row;
    margin: 0;
  }
  time {
    margin-bottom: 1.5em;
    text-align: center;
  }
  pre {
    font-size: 1.25em;
    background: rgba(var(--text-color), calc(var(--background-opacity) * 2));
    padding: 0.5em 1.5em;
    border-radius: 0.25em;
    margin: 0.5em 0;
  }

  @media (min-width: 48em) {
    div {
      flex-direction: row;
    }
    pre {
      margin: 0 1em;
    }
  }

  @media (min-width: 64em) {
  }
</style>
