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
  <DisclosureButton let:isOpen data-testid="disclosure-button">
    Toggle
    <span data-testid="button-isOpen-text">
      {isOpen}
    </span>
  </DisclosureButton>
  {#if isShowingPanel}
    <DisclosurePanel data-testid="disclosure-panel" let:close>
      <button on:click={close}> Close Panel </button>
    </DisclosurePanel>
  {/if}
</Disclosure>
