<script lang="ts">
  export let href: string | undefined = undefined;
</script>

<a {href} {...$$restProps}><slot /></a>

<style>
  a {
    color: rgb(var(--link-color));
    vertical-align: unset;
  }
</style>
