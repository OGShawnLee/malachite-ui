<script lang="ts">
  import { Popover, PopoverButton, PopoverOverlay, PopoverPanel } from '$lib/components';

  export let isShowingPanel = true;
  export let forceFocus: boolean  | undefined = undefined;
</script>

<button data-testid="external-button"> External Button </button>

<Popover {forceFocus} let:isOpen>
  <span data-testid="root-is-open-text"> {isOpen} </span>
  <PopoverButton data-testid="popover-button" let:isOpen>
    <span data-testid="button-is-open-text"> {isOpen} </span>
  </PopoverButton>
  <PopoverOverlay data-testid="popover-overlay" />
  {#if isShowingPanel}
    <PopoverPanel data-testid="popover-panel" let:close>
      <button on:click={close}>Close Panel</button>
    </PopoverPanel>
  {/if}
</Popover>
