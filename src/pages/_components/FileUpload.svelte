<script lang="ts">
  export let value: string = "";
  export let file: File | null | undefined;
  export let mimes: string[] = ["application/zip", "application/x-7z-compressed"];

  type LabelDragEvent = DragEvent & {
    currentTarget: EventTarget & HTMLLabelElement;
  };

  let dragging = false;
  let lastDragTime = 0;

  const onDragEnter = (e: LabelDragEvent) => {
    e.preventDefault();
    dragging = true;
  };
  const onDragLeave = (e: LabelDragEvent) => {
    dragging = false;
  };
  const onDragOver = (e: LabelDragEvent) => {
    e.preventDefault();
    lastDragTime = Date.now();
    setTimeout(() => {
      if (Date.now() - lastDragTime > 1000 * 2) {
        dragging = false;
      }
    });
  };

  const onDrop = (e: LabelDragEvent) => {
    e.preventDefault();
    const items = e?.dataTransfer?.items;
    if (items === undefined) return;
    const files = Array.from(items).filter(
      (item) => item.kind === "file" && mimes.includes(item.type)
    );
    if (files.length === 0) return;
    file = files[0].getAsFile();
  };

  const onChange = (
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    }
  ) => {
    const { files } = e.currentTarget;
    if (files === null || files.length === 0) {
      file = undefined;
      return;
    }
    file = files[0];
  };
</script>

<label
  class={file != null || dragging === true ? "selected" : ""}
  on:dragenter={onDragEnter}
  on:dragover={onDragOver}
  on:dragleave={onDragLeave}
  on:drop={onDrop}
>
  <input type="file" accept=".zip,.7z" bind:value on:change={onChange} {...$$restProps} />
  {#if file == null}
    <svg viewBox="0 0 24 24" enable-background="new 0 0 24 24"
      ><g
        ><path d="M18,15v3H6v-3H4v3c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-3H18z" /><path
          d="M7,9l1.41,1.41L11,7.83V16h2V7.83l2.59,2.58L17,9l-5-5L7,9z"
          class="arrow"
        /></g
      ></svg
    >
    <div><slot /></div>
  {:else}
    <div>
      {file.name}<br />({new Intl.NumberFormat().format(file.size / (1024 * 1024))} MiB)
    </div>
  {/if}
</label>

<style>
  label {
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 10em;
    padding: 1.5em;
    margin: 0.375em;
    border-radius: 0.25em;
    border: 0.125em dashed rgba(var(--text-color), calc(var(--background-opacity) * 5));
    color: rgba(var(--text-color), calc(var(--background-opacity) * 15));
    transition: color 0.15s, border-color 0.15s;
    cursor: pointer;
    z-index: 1;
  }
  label:hover {
    border-color: rgba(var(--link-color), 0.675);
  }
  .selected {
    border-color: rgba(var(--link-color), 1);
  }
  label > * {
    pointer-events: none;
  }
  svg {
    fill: rgba(var(--text-color), calc(var(--background-opacity) * 25));
    width: 4em;
    height: 4em;
  }
  .arrow {
    transition: transform 0.175s;
  }
  label:hover .arrow {
    transform: translateY(-0.2em);
  }
  div {
    display: block;
    font-family: var(--font-family);
    padding: 0.5em;
    transition: color 0.15s, transform 0.15s;
    user-select: none;
    word-break: break-all;
    text-align: center;
  }
  input {
    display: none;
  }
</style>
