<a href="/">
  <p class="styled-rect">CTF</p>
  <p>Archive</p>
</a>

<style>
  a {
    display: flex;
    flex-direction: column;
    font-family: Montserrat;
    font-weight: 800;
    align-items: center;
    font-size: 0.5em;
  }
  a > * {
    margin: 0;
    letter-spacing: 0.1em;
  }
  .styled-rect {
    font-size: 2em;
    padding: 0.1em 0.75em;
    color: #fff;
    background: #212121;
    clip-path: polygon(
      0 0,
      0 calc(100% - 0.5em),
      0.5em 100%,
      100% 100%,
      100% 0.5em,
      calc(100% - 0.5em) 0
    );
    /* clip-path: polygon(0 0.5em, 0 100%, calc(100% - 0.5em) 100%, 100% calc(100% - 0.5em), 100% 0, 0.5em 0); */

    margin-bottom: 0.25em;
  }
</style>
