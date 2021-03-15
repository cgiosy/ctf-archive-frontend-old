<script lang="ts">
  import BigLinkButton from "./_components/BigLinkButton.svelte";
</script>

<main>
  <div>
    <h1>404 Not Found</h1>
    <p>요청하신 페이지를 찾을 수 없었어요! ㅜㅜ</p>
    <BigLinkButton href="/">메인 화면으로 이동</BigLinkButton>
  </div>
</main>

<style>
  main,
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  div {
    width: 100%;
    max-width: var(--content-max-width);
    padding: 3.5em 1em;
  }
  p {
    margin: 1em 0 2.5em 0;
  }
</style>
