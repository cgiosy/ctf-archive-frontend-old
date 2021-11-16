<script lang="ts">
  import { useInfiniteQuery, useQueryClient } from "@sveltestack/svelte-query";
  import ExpIcon from "./ExpIcon.svelte";
  import ProfileImage from "./ProfileImage.svelte";
  import { get } from "../../libs/fetcher";
  import { useVars } from "../../libs/utils";
  import type { ISubmission } from "../../types";

  type GetSubmissionsSortKey = "time_asc" | "time_desc" | "commentTime_asc" | "commentTime_desc";
  type GetSubmissionsQueryKey = ["problem", number, "submissions", GetSubmissionsSortKey];

  const queryClient = useQueryClient();

  let self: HTMLDivElement;
  let clientWidth = 0;
  let cursorPosition = -10000;
  let currentComment: string = "";
  let currentLevel: number = -1000;
  let isPending = false;
  let minLevel = 0;
  let maxLevel = 0;
  const pageSize = 25;

  let queryKey: GetSubmissionsQueryKey;

  export let id: number;
  export let sort: GetSubmissionsSortKey = "commentTime_desc";

  const calcLevel = Math.max;

  const getSubmissions = ({ pageParam }: any) =>
    get<{ total: number; submissions: ISubmission[] }>(`/problems/${id}/submissions`, {
      sort,
      page: String(Number(pageParam) || 1),
    });

  const submissions = useInfiniteQuery({
    queryFn: getSubmissions,
    enabled: false,
  });

  const onParamsChanged = async () => {
    const newQueryKey: GetSubmissionsQueryKey = [
      "problem",
      id,
      "submissions",
      sort,
      // (page = Math.max(Number($params.page) || 1, 1)),
    ];
    if (queryKey !== undefined) await queryClient.cancelQueries(queryKey);
    queryKey = newQueryKey;
    submissions.setOptions({
      queryKey,
      queryFn: getSubmissions,
      getNextPageParam: (lastGroup, pages) =>
        lastGroup.total > (pages.length - 1) * pageSize + pages[pages.length - 1].submissions.length
          ? pages.length + 1
          : undefined,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });
  };

  const scrollHorizontally = (e: WheelEvent) => {
    // TODO: smooth scroll
    if (e.currentTarget === self) self.scrollLeft += e.deltaY;
  };

  const moveCursorToSubmission = (e: MouseEvent) => {
    const elm = e.currentTarget as HTMLDivElement;
    cursorPosition = elm.offsetLeft + elm.offsetWidth / 2;
    currentComment = elm.dataset.comment ?? "";
    currentLevel = Number(elm.dataset.level) ?? 0;
  };

  $: useVars(id, sort), onParamsChanged();
  $: {
    if (
      !isPending &&
      !$submissions.isFetching &&
      $submissions.hasNextPage &&
      self.scrollLeft >= clientWidth - self.scrollWidth - 48 * 6
    ) {
      isPending = true;
      $submissions.fetchNextPage().then((data) => {
        isPending = false;
        const pages = data.data?.pages;
        if (!pages) return;
        const { submissions } = pages[pages.length - 1];
        for (const { levels } of submissions) {
          maxLevel = Math.max(maxLevel, calcLevel(...levels));
          minLevel = Math.min(minLevel, calcLevel(...levels));
        }
      });
    }
  }

  let submissionHeight = 83.5;
  const levelToYPos = (height: number, level: number) =>
    (minLevel < maxLevel ? (maxLevel - level) / (maxLevel - minLevel) : 1 / 2) *
      (height - submissionHeight * 3.5) +
    submissionHeight * 0.75;
  const generatePath = (xl: number, yl: number, xr: number, yr: number) => {
    const xm = (xl + xr) / 2;
    const ym = (yl + yr) / 2;
    return `M${xm},${ym} S${xm},${yl} ${xl},${yl} M${xm},${ym} S${xm},${yr} ${xr},${yr}`;
  };
</script>

<div
  class="submissions"
  bind:this={self}
  bind:clientWidth
  on:wheel|preventDefault={scrollHorizontally}
>
  <div class="submission-container">
    {#if $submissions.isSuccess}
      <svg class="submission-lines">
        {#each $submissions.data.pages as page, j}
          {#each page.submissions as _, i}
            {#if i + 1 !== page.submissions.length || j + 1 !== $submissions.data.pages.length}
              <path
                d={generatePath(
                  (i * 10 + 12.5) * 16 + 56,
                  levelToYPos(self?.offsetHeight, calcLevel(...page.submissions[i].levels)) + 28,
                  ((i + 1) * 10 + 12.5) * 16 - 56,
                  levelToYPos(
                    self?.offsetHeight,
                    calcLevel(
                      ...(i + 1 === page.submissions.length
                        ? $submissions.data.pages[j + 1].submissions[0]
                        : page.submissions[i + 1]
                      ).levels
                    )
                  ) + 28
                )}
              />
            {/if}
          {/each}
        {/each}
      </svg>
      {#each $submissions.data.pages as { total, submissions }}
        {#each submissions as { username, profileImage, levels, exps, comment, time, commentTime }}
          <div
            class="submission"
            on:mouseenter={moveCursorToSubmission}
            data-comment={comment}
            data-level={calcLevel(...levels)}
          >
            <a
              href={"/profile/" + username}
              style="transform: translateY({levelToYPos(
                self?.offsetHeight,
                calcLevel(...levels)
              )}px)"
            >
              <ProfileImage src={profileImage} alt={username} />
              <div class="user-info">
                <ExpIcon {exps} stopped={true} small={true} />
                {username}
              </div>
            </a>
          </div>
        {/each}
      {/each}
      <div class="submission-cursor" style="transform: translateX({cursorPosition}px)" />
      <div
        class="submission-comment"
        style="transform: translateX(calc({cursorPosition}px - 50%)) translateY(calc({levelToYPos(
          self?.offsetHeight,
          currentLevel
        ) +
          submissionHeight / 3}px + 75%))"
      >
        {currentComment}
      </div>
    {/if}
  </div>
</div>

<style>
  .submissions {
    position: relative;
    display: flex;
    width: 100%;
    max-width: calc(var(--content-max-width) * 1.175);
    height: 576px;
    border: 1px solid rgba(var(--text-color), calc(var(--background-opacity) * 6));
    border-radius: 8px;
    margin: 16px 0;
    overflow: scroll hidden;
  }
  .submission-lines {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  path {
    fill: none;
    stroke: rgb(var(--link-color));
    stroke-width: 2px;
  }
  .submission-container {
    position: relative;
    display: flex;
    padding: 0 120px;
    /*
    position: absolute;
    height: 100%;
    */
  }
  .submission {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 160px;
  }
  .submission-cursor {
    position: absolute;
    height: 100%;
    left: -1px;
    border: 1px dashed rgba(var(--text-color), calc(var(--background-opacity) * 3));
    transition: transform 0.175s;
    z-index: -1;
  }
  .submission-comment {
    position: absolute;
    display: flex;
    left: -1px;
    width: 320px;
    min-height: 80px;
    padding: 16px 24px;
    justify-content: center;
    align-items: center;
    background-color: rgb(var(--background-color));
    border-radius: 4px;
    border: 1px solid rgba(var(--text-color), calc(var(--background-opacity) * 3));
    box-shadow: 0 1px 8px rgba(var(--text-color), calc(var(--background-opacity) * 3));
    transform-origin: center center;
    transition: transform 0.175s;
    z-index: 1;
    pointer-events: none;
  }
  a {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 120px;
    flex-shrink: 0;
    background-color: rgb(var(--background-color));
  }
  .user-info {
    font-size: 0.75em;
  }
</style>
