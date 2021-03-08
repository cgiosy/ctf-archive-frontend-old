<script lang="ts">
  export let href: string;
</script>

<a {href}><slot /></a>

<style>
  a {
    display: inline-flex;
    justify-content: center;
    color: rgb(var(--link-color));
    padding: 1.25em 3em;
    margin: 0.25em 0.5em;
    border-radius: 2.5em;
    font-weight: bold;
    transition: background-color 0.25s;
  }
  a:hover {
    background-color: rgba(var(--text-color), var(--background-opacity));
  }
</style>
