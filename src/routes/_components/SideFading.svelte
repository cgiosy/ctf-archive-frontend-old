<div><slot /></div>

<style>
  div {
    display: inline-block;
    height: calc(2em + 12px);
    overflow: hidden;
    transform: translateZ(0);
    margin: 1em 0;
    max-width: 100%;
  }
  div::before {
    content: "";
    position: fixed;
    top: -1.5em;
    left: 0;
    width: 100%;
    height: calc(100% + 3em);
    box-shadow: inset 0 0 2em rgb(var(--background-color)),
      inset 0 0 2em rgb(var(--background-color)), inset 0 0 2em rgb(var(--background-color)),
      inset 0 0 2em rgb(var(--background-color)), inset 0 0 2em rgb(var(--background-color));
    pointer-events: none;
  }
</style>
