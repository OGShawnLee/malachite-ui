<script lang="ts">
  import { Popover, PopoverButton, PopoverOverlay, PopoverPanel } from '$lib/components';
  import { generateActions } from '@test-utils';
</script>

<Popover forceFocus use={generateActions(3)}>
  <PopoverButton data-testid="popover-button" use={generateActions(3)}>Button</PopoverButton>
  <PopoverOverlay data-testid="popover-overlay" />
  <PopoverPanel data-testid="popover-panel" let:close use={generateActions(3)}>
    <button on:click={close}> Close Me </button>
  </PopoverPanel>
</Popover>
