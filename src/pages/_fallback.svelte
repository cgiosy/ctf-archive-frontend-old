<script lang="ts">
  import BigLinkButton from './_components/BigLinkButton.svelte';
</script>

<main>
  <h1>404 Not Found</h1>
  <p>요청하신 페이지를 찾을 수 없었어요! ㅜㅜ</p>
  <div><BigLinkButton href='/'>메인 화면으로 이동</BigLinkButton></div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
  }
  main > * {
    max-width: var(--content-max-width);
    margin: 1em 0;
  }
</style>
