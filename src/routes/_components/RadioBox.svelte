<script lang="ts">
  export let group: string;
  export let value: string;
  export let equal: (a: string, b: string) => boolean = (a, b) => a === b;

  let selected: boolean = false;

  $: {
    selected = equal(group, value);
  }
</script>

<label class:selected><input type="radio" {value} bind:group /><slot /></label>

<style>
  label {
    display: inline-flex;
    padding: 0.5em 1em;
    margin: 1em 0.25em;
    align-items: center;
    justify-content: center;
    user-select: none;
    cursor: pointer;
    border: 0.0625em solid transparent;
    transition: background-color 0.175s, border-color 0.175s, box-shadow 0.175s,
      transform 0.175s ease-out;
  }
  label:hover,
  label:focus,
  .selected {
    background-color: rgba(var(--text-color), calc(var(--background-opacity) * 0.25));
    border-color: rgba(var(--text-color), calc(var(--background-opacity) * 2));
    box-shadow: 0 0.0625em 0.375em 0 rgba(var(--text-color), calc(var(--background-opacity) * 3));
    transform: translateY(-0.1875em);
  }
  input {
    display: none;
  }
</style>
