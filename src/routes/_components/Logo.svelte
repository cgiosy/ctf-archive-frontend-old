<a href="/">
  <p class="styled-rect">CTF</p>
  <p>Archive</p>
</a>

<style>
  a {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    font-family: Montserrat;
    font-weight: 800;
    font-size: 0.5em;
    user-select: none;
    -webkit-user-drag: none;
    transition: transform 0.15s;
    will-change: transform;
  }
  a:hover,
  a:focus {
    transform: scale(1.05);
  }
  p {
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
