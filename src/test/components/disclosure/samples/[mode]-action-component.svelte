<script lang="ts">
  import { Disclosure } from '$lib/components';

  export let open: boolean | undefined = undefined;
  export let isShowingPanel = true;
</script>

<span data-testid="isOpen-binding"> {open} </span>

<Disclosure bind:open data-testid="disclosure-root" let:isOpen let:button let:panel let:close>
  <span data-testid="root-isOpen-text">
    {isOpen}
  </span>
  <button on:click={close}> Close Disclosure </button>
  <button data-testid="disclosure-button" use:button>
    Toggle
    <span data-testid="button-isOpen-text">
      {isOpen}
    </span>
  </button>
  <svelte:fragment slot="panel">
    {#if isShowingPanel}
      <div data-testid="disclosure-panel" use:panel>
        <button on:click={close}> Close Panel </button>
      </div>
    {/if}
  </svelte:fragment>
</Disclosure>
