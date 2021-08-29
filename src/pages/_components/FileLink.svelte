<script lang="ts">
  export let id: number;
  export let key: string;
  export let name: string | undefined = undefined;
  export let float: "left" | "right" | undefined = undefined;
</script>

<a href={`//cdn.ctf-archive.com/ctf/${id}-${key}.7z`} download={name && name + ".7z"} class={float}
  ><svg viewBox="0 0 24 24"
    ><g
      ><path
        d="M18,15v3H6v-3H4v3c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-3H18z M17,11l-1.41-1.41L13,12.17V4h-2v8.17L8.41,9.59L7,11l5,5 L17,11z"
      /></g
    ></svg
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
