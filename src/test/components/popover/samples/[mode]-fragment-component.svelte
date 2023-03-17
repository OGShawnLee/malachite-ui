<script lang="ts">
  import { Popover, PopoverButton, PopoverOverlay, PopoverPanel } from '$lib/components';

  export let isShowingPanel = true;
  export let forceFocus: boolean  | undefined = undefined;
</script>

<button data-testid="external-button"> External Button </button>

<Popover {forceFocus} let:isOpen>
  <span data-testid="root-is-open-text"> {isOpen} </span>
  <PopoverButton as="fragment" let:isOpen let:button>
    <button data-testid="popover-button" use:button>
      <span data-testid="button-is-open-text"> {isOpen} </span>
    </button>
  </PopoverButton>
  <PopoverOverlay as="fragment" let:overlay>
    <div data-testid="popover-overlay" use:overlay></div>
  </PopoverOverlay>
  {#if isShowingPanel}
    <PopoverPanel as="fragment" let:close let:panel>
      <div data-testid="popover-panel" use:panel>
        <button on:click={close}>Close Panel</button>
      </div>
    </PopoverPanel>
  {/if}
</Popover>
