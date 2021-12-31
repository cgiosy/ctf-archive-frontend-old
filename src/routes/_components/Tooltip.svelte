<script lang="ts">
  export let text: string;
</script>

<div data-tooltip={text}><slot /></div>

<style>
  div {
    position: relative;
  }
  div::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: -50%;
    left: 50%;
    min-width: 5em;
    padding: 0.5em 1.25em;
    border-radius: 0.25em;
    color: rgb(var(--background-color));
    background: rgba(var(--text-color), calc(var(--background-opacity) * 16));
    pointer-events: none;
    opacity: 0;
    transform: translate(-50%, 1em) scale(0);
    transform-origin: top;
    transition: opacity 0.25s, transform 0.175s;
    word-break: keep-all;
    white-space: nowrap;
  }
  div:hover::after {
    opacity: 1;
    transform: translate(-50%, 1em) scale(1);
  }
</style>
