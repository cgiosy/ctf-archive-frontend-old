<script lang="ts">
  import Logo from "../_components/Logo.svelte";
  import BigLinkButton from "../_components/BigLinkButton.svelte";
  import { metatags } from "@roxi/routify";
  import { update_slot } from "svelte/internal";
  metatags.title = "CTF Archive";
  metatags.description = "CTF Archive";
  let standings = [
    { score: 69, name: "ryute" },
    { score: 74, name: "cgiosy" },
    { score: 420, name: "l0tus" },
  ];
</script>

<main>
  <header>
    <div class="banner-logo">
      <Logo />
    </div>
    <section>
      <h1>시간에 구애받지 않고 즐기는<br />CTF 문제풀이 사이트</h1>
      <section>
        대회가 끝나면 더이상 볼 수 없었던 문제들, 모두 안녕!<br />기존에 출제된 문제들을 재현하여
        사이트에서 채점받고, 랭킹을 보며 실력을 증진할 수 있습니다.
      </section>
    </section>
  </header>
</main>

<div class="problemsets">
  <div style="height: 5125px; padding-top: 0px; box-sizing: border-box;">
    <div class="problemsets__items">
      <div class="problemsets__items-row">
        <div class="problemsets__item">
          <div class="problemset-panel__panel">
            <a href="contest" class="problemset-panel__header">
              <img
                src="/assets/images/logo/utctf.png"
                alt="error"
                class="problemset-panel__image"
              />
              <div class="problemset-panel__image-overlay" />
              <div class="problemset-panel__status-container">
                <div class="problemset-status">2021</div>
              </div>
              <div class="problemset-panel__title-organizer-box">
                <div class="problemset-panel__header-text problemset-panel__header-text--title">
                  <span class="u-ellipsis-overflow">UTCTF 2021</span>
                </div>
                <div class="u-ellipsis-overflow problemset-panel__header-text">hhh_</div>
              </div>
              <div class="problemset-panel__counts-box">
                <div
                  class="problemset-panel__count"
                  data-orig-title="풀린 횟수: 4"
                  data-hasqtip="45"
                >
                  <span class="problemset-panel__count-number">69</span>
                </div>
                <div
                  class="problemset-panel__count"
                  data-orig-title="즐겨찾기 수: 4"
                  data-hasqtip="40"
                >
                  <span class="problemset-panel__count-number">74</span>
                </div>
              </div>
            </a>
            <div class="problemset-panel__content">
              <div class="beatmapset-panel__difficulties">
                <div class="beatmapset-panel__difficulty-icon" />
              </div>
            </div>
            <div class="problemset-panel__shadow" />
          </div>
        </div>
        <div class="problemsets__item">
          <div class="problemset-panel__panel">
            <a href="contest" class="problemset-panel__header">
              <img
                src="/assets/images/logo/zer0pts.png"
                alt="error"
                class="problemset-panel__image"
              />
              <div class="problemset-panel__image-overlay" />
              <div class="problemset-panel__status-container">
                <div class="problemset-status">2021</div>
              </div>
              <div class="problemset-panel__title-organizer-box">
                <div class="problemset-panel__header-text problemset-panel__header-text--title">
                  <span class="u-ellipsis-overflow">zer0pts CTF 2021</span>
                </div>
                <div class="u-ellipsis-overflow problemset-panel__header-text">zer0pts</div>
              </div>
              <div class="problemset-panel__counts-box">
                <div
                  class="problemset-panel__count"
                  data-orig-title="풀린 횟수: 4"
                  data-hasqtip="45"
                >
                  <span class="problemset-panel__count-number">320</span>
                </div>
                <div
                  class="problemset-panel__count"
                  data-orig-title="즐겨찾기 수: 4"
                  data-hasqtip="40"
                >
                  <span class="problemset-panel__count-number">17</span>
                </div>
              </div>
            </a>
            <div class="problemset-panel__content">
              <div class="beatmapset-panel__difficulties">
                <div class="beatmapset-panel__difficulty-icon" />
              </div>
            </div>
            <div class="problemset-panel__shadow" />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  * {
    box-sizing: border-box;
  }
  main > * {
    padding: 5rem;
  }

  header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 20rem;
    background: url("/assets/images/banner-background.jpg") center center / cover;
    color: #212121;
  }
  .banner-logo {
    font-size: 4em;
  }

  header > section {
    font-size: 1.05em;
    margin-top: 3em;
  }

  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 1rem 0;
  }
  main > section {
    padding: 3rem 0;
  }
  .links {
    padding: 2rem 0;
  }

  @media (min-width: 1024px) {
    header {
      flex-direction: row;
    }
    header > section {
      margin-top: 0;
      margin-left: 6em;
    }
  }

  @media (min-width: 640px) {
    .links {
      flex-direction: row;
    }
  }

  img {
    vertical-align: middle;
  }
  img {
    border: 0;
  }
  div {
    display: block;
  }
  .problemsets {
    background-color: hsl(var(--hsl-b5));
    color: #fff;
  }
  .problemsets__items {
    display: flex;
    flex-wrap: wrap;
  }
  .problemsets__items-row {
    display: flex;
    width: 70%;
    align-self: center;
    margin-left: auto;
    margin-right: auto;
  }
  .problemsets__item {
    margin: 5px;
    flex: none;
    width: calc(50% - 10px);
  }
  .problemset-panel__panel {
    transform: translateZ(0);
    box-shadow: 0 1px 3px rgb(0 0 0 / 25%);
    border-radius: 6px 6px 4px 4px;
    width: 100%;
    background: hsl(var(--hsl-b3));
  }
  .problemset-panel__header {
    display: block;
    color: #fff;
    text-decoration: none;
    text-shadow: 0 1px 1px rgb(0 0 0 / 75%);
    background-image: url(/assets/images/default-bg.7594e945.png);
    background-size: auto auto;
    background-position: 50%;
    background-size: cover;
    font-weight: 400;
    height: 120px;
    border-radius: 4px 4px 0 0;
    overflow: hidden;
    position: relative;
  }
  .problemset-panel__image {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
  .problemset-panel__image-overlay {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.4);
  }
  .problemset-panel__status-container {
    display: flex;
    position: absolute;
    margin: 5px;
    transition: all 0.15s ease-in-out;
  }
  .problemset-status {
    /*background-color: hsla(var(--hsl-b4),.7);*/
    padding: 6px 15px;
    border-radius: 10000px;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    text-transform: uppercase;
    /*color: hsl(var(--hsl-c1));*/
    transition: all 0.12s ease-in-out;
  }
  .problemset-panel__title-organizer-box {
    position: absolute;
    left: 10px;
    bottom: 10px;
    width: calc(100% - 20px);
  }
  .problemset-panel__header-text--title {
    font-size: 1.3em;
    display: flex;
    align-items: center;
  }
  .problemset-panel__header-text {
    font-weight: 600;
    font-size: 14px;
  }
  .u-ellipsis-overflow {
    white-space: nowrap !important;
    text-overflow: ellipsis !important;
    overflow: hidden !important;
  }
  .problemset-panel__counts-box {
    position: absolute;
    right: 10px;
    top: 10px;
    display: flex;
  }
  .problemset-panel__count {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-left: 16px;
  }
  .problemset-panel__count-number {
    padding-right: 5px;
  }
  .problemset-panel__content {
    height: 75px;
    padding: 10px;
  }
  .problemset-panel__shadow {
    border-radius: 4px;
    transform: translateZ(0);
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    box-shadow: 0 10px 20px rgb(0 0 0 / 25%);
    transition: all 0.15s ease-in-out;
    opacity: 1;
    pointer-events: none;
  }
</style>
