<script lang="ts">
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogOverlay,
    DialogTitle
  } from '$lib/components';
  import type { Maybe } from '$lib/types';
  import { useRange } from '@test-utils';

  export let descriptions = useRange(1);
  export let titles = useRange(1);
  export let open: Maybe<boolean> = undefined;
  export let initialFocus: Maybe<HTMLElement> = undefined;
  export let isShowingInitialFocus = false;

  function toggle() {
    open = !open;
  }
</script>

<button type="submit" on:click={toggle}> Toggle </button>
<span data-testid="binding-open"> {open} </span>

<Dialog
  bind:open
  {initialFocus}
  data-testid="dialog-container"
  let:dialog
  let:content
  let:overlay
  let:close
>
  <div use:dialog>
    <button> Invalid 1 </button>
    <div use:overlay data-testid="dialog-overlay">
      <button> Invalid 2 </button>
    </div>
    <div use:content data-testid="dialog-content">
      {#each $titles as index}
        <DialogTitle>
          Title {index}
        </DialogTitle>
      {/each}
      {#each $descriptions as index}
        <DialogDescription>
          Description {index}
        </DialogDescription>
      {/each}
      <footer>
        <button on:click={close}> Close Me </button>
        {#if isShowingInitialFocus}
          <button bind:this={initialFocus}> Initial Focus </button>
        {/if}
      </footer>
    </div>
  </div>
</Dialog>
