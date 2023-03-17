<script lang="ts">
  import { Popover } from '$lib/components';

  export let isShowingPanel = true;
  export let forceFocus: boolean  | undefined = undefined;
</script>

<button data-testid="external-button"> External Button </button>

<Popover {forceFocus} let:isOpen let:button let:panel let:overlay let:close>
  <span data-testid="root-is-open-text"> {isOpen} </span>
  <button data-testid="popover-button" use:button>
    <span data-testid="button-is-open-text"> {isOpen} </span>
  </button>
  <div data-testid="popover-overlay" slot="overlay" use:overlay />
  <svelte:fragment slot="panel">
    {#if isShowingPanel}
    <div data-testid="popover-panel" use:panel>
      <button on:click={close}>Close Panel</button>
    </div>
    {/if}
  </svelte:fragment>
</Popover>
