<script lang="ts">
  import { getImageUrl } from "../../libs/utils";

  export let src: string = "";
  export let size: "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl" = "sm";
  export let alt: string = "";
</script>

<img
  src={getImageUrl(src) ?? `/assets/images/default-profile-image-${size}.png`}
  class={size}
  {alt}
/>

<style>
  img {
    border-radius: 50%;
    margin: 0.25rem;
  }
  .xs {
    width: 1.5em;
    height: 1.5em;
  }
  .sm {
    width: 2.25em;
    height: 2.25em;
  }
  .lg {
    width: 10em;
    height: 10em;
  }
</style>
