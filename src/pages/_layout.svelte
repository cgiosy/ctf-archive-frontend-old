<!-- routify:options preload="proximity" -->
<script lang="ts">
  import TopBar from "./_components/TopBar.svelte";
  import Footer from "./_components/Footer.svelte";
</script>

<TopBar />
<slot />
<Footer />

<style global>
  :root {
    /* Light Theme */
    /*
    --text-color: 21, 32, 43;
    --background-color: 255, 255, 255;
    --background-opacity: 0.05;
    */

    /* Dark Theme */
    --text-color: 255, 255, 255;
    --background-color: 17, 17, 17;
    --background-opacity: 0.0625;

    /* Black Theme */
    /*
    --text-color: 255, 255, 255;
    --background-color: 0, 0, 0;
    --background-opacity: 0.1;
    */

    /* Others */
    --link-color: 61, 90, 254;
    --content-max-width: 70rem;
  }

  * {
    box-sizing: border-box;
  }
  body {
    color: rgb(var(--text-color));
    background: rgb(var(--background-color));
    margin: 0;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
</style>
