<script lang="ts">
  import LevelIcon from "./LevelIcon.svelte";
  import type { IProblem } from "../../types";
  import { emptyImageUrl, style } from "../../libs/utils";

  export let problem: IProblem | undefined = undefined;
  export let solved: boolean = false;
  export let wallpaper: string = "";
  export let wallpaperPos: number = 50;

  // 디버깅용 함수
  // on:wheel|preventDefault={scrollHorizontally}
  const scrollHorizontally = (e: WheelEvent) => {
    wallpaperPos = Math.max(0, Math.min(100, wallpaperPos + (e.deltaY / Math.abs(e.deltaY)) * 1));
  };
</script>

{#if problem !== undefined}
  <a
    href={`/problems/${problem.id}`}
    class="problem{solved ? ' solved' : ''}"
    style={style({
      "--wallpaper-pos": (wallpaperPos ?? 50) + "%",
      "--wallpaper-image": wallpaper && `url('${`/assets/wallpapers/${wallpaper}.jpg`}')`,
    })}
  >
    <LevelIcon levels={problem.levels} />
    <section>
      <h3 class="title">{problem.title}</h3>
      <div class="info">
        <a href={`/?q=${encodeURIComponent(problem.source)}`} class="source">{problem.source}</a>
        <span class="solves"><b>✓</b> {problem.solves}</span>
      </div>
    </section>
  </a>
{:else}
  <span class="problem" style="pointer-events: none">
    <LevelIcon />
    <section>
      <h3 class="title">&nbsp;</h3>
      <div class="info">&nbsp;</div>
    </section>
  </span>
{/if}

<style>
  .problem {
    display: flex;
    align-items: center;
    contain: content;
    padding: 1.5em 1.25em;
    margin: 0.5em;
    border-radius: 0.5em;
    background-size: cover;
    /* 2 vs 2.5 vs 3 */
    border: 0.0625em solid rgba(var(--text-color), calc(var(--background-opacity) * 2));
    box-shadow: 0 0.0625em 0.375em 0 rgba(var(--text-color), calc(var(--background-opacity) * 2));
    transition: border 0.175s, box-shadow 0.175s, transform 0.175s ease-out;
    background-image: linear-gradient(
        to right,
        rgba(32, 32, 32, 0.95),
        rgba(32, 32, 32, 0.8),
        rgba(32, 32, 32, 0.35)
      ),
      var(--wallpaper-image);
    background-position: top var(--wallpaper-pos), center;
  }
  .problem:hover {
    border: 0.0625em solid rgba(var(--text-color), calc(var(--background-opacity) * 4));
    box-shadow: 0 0.125em 0.75em 0 rgba(var(--text-color), calc(var(--background-opacity) * 4));
    transform: translateY(-0.1875em);
  }
  .solved,
  .solved:hover {
    border-left: 0.5em solid rgba(0, 206, 96, calc(var(--background-opacity) * 22));
  }
  .solved {
    padding-left: 0.8125em;
  }
  div {
    margin: 0.5em 0;
  }
  section {
    min-width: 0;
    width: 100%;
    margin-left: 1.25em;
  }
  .title {
    /* font-family: Montserrat; */
    margin: 0;
  }
  .title,
  .source {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .info {
    display: flex;
    font-size: 0.9375em;
    /* font-size: 0.875em; */
    justify-content: space-between;
  }
  .source {
    margin-right: 1em;
  }
  .source:hover {
    text-decoration: underline;
  }
  .solves {
    /* font-family: "Spoqa Han Sans KR"; */
    margin-left: auto;
    flex-shrink: 0;
  }
</style>
