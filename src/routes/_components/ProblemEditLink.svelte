<script lang="ts">
  export let id: number;
  export let float: "left" | "right" | undefined = undefined;
</script>

<a href={`/problems/${id}/edit`} class={float}
  ><svg viewBox="0 0 24 24"
    ><path d="M0 0h24v24H0V0z" fill="none" /><path
      d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"
    /></svg
  ></a
>

<style>
  a {
    display: inline-flex;
    font-size: 2em;
    width: 1em;
    height: 1em;
  }
  svg {
    fill: rgba(var(--text-color), calc(var(--background-opacity) * 25));
    width: 1em;
    height: 1em;
  }
  .right {
    float: right;
  }
</style>
