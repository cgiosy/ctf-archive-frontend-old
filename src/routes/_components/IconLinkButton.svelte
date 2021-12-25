<script lang="ts">
  export let href: string | undefined = undefined;
</script>

<a {href} {...$$restProps}><slot /></a>

<style>
  a {
    display: inline-flex;
    color: rgb(var(--text-color));
    width: 2em;
    height: 2em;
    align-items: center;
    justify-content: center;
    background: none;
    margin: 0.125em;
    font-size: 1.5em;
    border: none;
    border-radius: 50%;
    transition: background-color 0.25s;
    cursor: pointer;
    user-select: none;
  }
  a[disabled] {
    background-color: rgba(var(--text-color), calc(var(--background-opacity) * 0.75));
    pointer-events: none;
  }
  a:hover,
  a:focus {
    background-color: rgba(var(--text-color), var(--background-opacity));
  }
</style>
