<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <circle
    cx="16"
    cy="16"
    r="12.5"
    fill="none"
    stroke-dasharray="98.125"
    stroke-dashoffset="39.27"
    stroke-width="3"
  />
</svg>

<style>
  svg {
    width: 32px;
    height: 32px;
    animation: spin linear 0.5s infinite;
    stroke: rgb(var(--link-color));
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
