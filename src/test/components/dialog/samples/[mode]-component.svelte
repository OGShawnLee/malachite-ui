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

<button on:click={toggle}> Toggle </button>
<span data-testid="binding-open"> {open} </span>

<Dialog bind:open {initialFocus} data-testid="dialog-container">
  <button> Invalid 1 </button>
  <DialogOverlay data-testid="dialog-overlay">
    <button> Invalid 2 </button>
  </DialogOverlay>
  <DialogContent data-testid="dialog-content" let:close>
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
  </DialogContent>
</Dialog>
