<script lang="ts">
  import type { Maybe } from '$lib/types';
  import { Popover, PopoverButton, PopoverGroup, PopoverOverlay, PopoverPanel } from '$lib';

  export let forceFocus: Maybe<boolean> = undefined;
</script>

<PopoverGroup let:isOpen>
  <span data-testid="binding-open-group">{isOpen}</span>
  <Popover>
    <PopoverButton data-testid="popover-button" />
    <PopoverOverlay data-testid="popover-overlay" />
    <PopoverPanel data-testid="popover-panel" />
  </Popover>
  <Popover>
    <PopoverButton data-testid="popover-button" />
    <PopoverOverlay data-testid="popover-overlay" />
    <PopoverPanel data-testid="popover-panel" />
  </Popover>
  <Popover {forceFocus}>
    <PopoverButton data-testid="popover-button" />
    <PopoverOverlay data-testid="popover-overlay" />
    <PopoverPanel data-testid="popover-panel" />
  </Popover>
</PopoverGroup>
