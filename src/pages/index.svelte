<script lang="ts">
  import Logo from "./_components/Logo.svelte";
  import BigLinkButton from "./_components/BigLinkButton.svelte";
  import { metatags } from "@roxi/routify";
  metatags.title = "CTF Archive";
  metatags.description = "CTF Archive";
</script>

<main>
  <header>
    <div class="banner-logo">
      <Logo />
    </div>
    <section class="intro">
      <h1>시간에 구애받지 않고 즐기는<br />CTF 문제풀이 사이트</h1>
      <p>
        대회가 끝나면 더이상 볼 수 없었던 문제들, 모두 안녕!<br />기존에 출제된 문제들을 재현하여
        사이트에서 채점받고, 랭킹을 보며 실력을 증진할 수 있습니다.
      </p>
    </section>
  </header>

  <section>
    <h2>지금 바로 문제를 풀어보세요</h2>
    <p>포너블, 리버싱, 크립토, 웹 등 다양한 분야의 문제들이 준비되어 있어요.</p>
    <ul>
      <li><BigLinkButton href="/problems">문제 풀러 가기</BigLinkButton></li>
      <li><BigLinkButton href="/tags">태그 목록 보기</BigLinkButton></li>
    </ul>
  </section>

  <section>
    <h2>얼마나 잘하고 있는지 궁금하다면</h2>
    <p>
      문제를 풀면 경험치와 레벨이 올라가며 실시간으로 랭킹을 볼 수 있어요.<br />어려운 문제일 수록
      경험치가 많고, 체감 난이도를 적어 주시면 생태계에 도움이 돼요!
    </p>
    <ul>
      <li><BigLinkButton href="/ranking">전체 랭킹</BigLinkButton></li>
      <li><BigLinkButton href="/ranking/friends">친구 랭킹</BigLinkButton></li>
      <li>
        <BigLinkButton href="/ranking/contribution">기여 랭킹</BigLinkButton>
      </li>
    </ul>
  </section>

  <section>
    <h2>원하는 문제가 있으신가요?</h2>
    <p>
      분류와 제목, 난이도, 태그 등 여러 조건을 사용해 내가 원하는 문제를 쉽고 빠르게 찾을 수 있어요.
    </p>
    <ul>
      <li><BigLinkButton href="/search">검색 페이지로 이동</BigLinkButton></li>
    </ul>
  </section>

  <section>
    <h2>디스코드에서 더 많은 얘기를 나눠보세요</h2>
    <p>CTF 문제, 풀이, 잡담 및 사이트 관련 건의 등을 주제로 대화합니다.</p>
    <ul style="padding: 2.5em 0;">
      <a href="https://discord.gg/3JCgQQfSwj">
        <img src="/assets/images/discord-icon.png" alt="Discord Icon" width="96" height="96" />
      </a>
    </ul>
  </section>
</main>

<style>
  * {
    word-break: keep-all;
  }

  main,
  header,
  section,
  ul,
  li {
    display: flex;
    flex-direction: column;
  }
  main,
  header {
    align-items: center;
  }
  header,
  section,
  ul,
  li {
    justify-content: center;
  }
  header {
    width: 100%;
    padding: 3rem;
    background: url("/assets/images/banner-background.jpg") center center / cover;
    color: #212121;
    /* text-shadow: 0 0.1em 0.3em rgba(33, 33, 33, 0.2); */
  }
  section {
    text-align: center;
    max-width: var(--content-max-width);
    padding: 3rem 1rem;
  }
  ul {
    list-style: none;
    padding: 1rem 0;
    margin: 0;
  }
  .banner-logo {
    font-size: 4em;
  }
  .intro {
    font-size: 1.05em;
  }

  @media (min-width: 64em) {
    header {
      flex-direction: row;
    }
    .intro {
      padding: 0;
      margin-left: 6em;
    }
  }

  @media (min-width: 40em) {
    ul {
      flex-direction: row;
    }
  }
</style>
