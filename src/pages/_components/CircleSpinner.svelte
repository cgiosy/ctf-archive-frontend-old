<svg>
  <circle />
</svg>

<style>
  svg {
    width: 2em;
    height: 2em;
    animation: spin linear 0.5s infinite;
    stroke: rgb(var(--link-color));
  }
  circle {
    cx: 1em;
    cy: 1em;
    r: 0.75em;
    fill: none;
    stroke-dasharray: 6em;
    stroke-dashoffset: 2.5em;
    stroke-width: 0.1875em;
  }
  @keyframes spin {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0);
    }
  }
</style>
