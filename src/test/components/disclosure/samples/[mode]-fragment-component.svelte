<script lang="ts">
  import { Disclosure, DisclosureButton, DisclosurePanel } from '$lib/components';

  export let open: boolean | undefined = undefined;
  export let isShowingPanel = true;
</script>

<span data-testid="isOpen-binding"> {open} </span>

<Disclosure bind:open data-testid="disclosure-root" let:isOpen let:close>
  <span data-testid="root-isOpen-text">
    {isOpen}
  </span>
  <button on:click={close}> Close Disclosure </button>
  <DisclosureButton as="fragment" let:isOpen let:button>
    <button data-testid="disclosure-button" use:button>
      Toggle
      <span data-testid="button-isOpen-text">
        {isOpen}
      </span>
    </button>
  </DisclosureButton>
  {#if isShowingPanel}
    <DisclosurePanel as="fragment" data-testid="disclosure-panel" let:panel let:close>
      <div data-testid="disclosure-panel" use:panel>
        <button on:click={close}> Close Panel </button>
      </div>
    </DisclosurePanel>
  {/if}
</Disclosure>
>