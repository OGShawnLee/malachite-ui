<script lang="ts">
  import type { Maybe } from '$lib/types';
  import { Popover, PopoverButton, PopoverGroup, PopoverOverlay, PopoverPanel } from '$lib';

  export let forceFocus: Maybe<boolean> = undefined;
</script>

<PopoverGroup let:isOpen>
  <span data-testid="binding-open-group">{isOpen}</span>
  <Popover>
    <PopoverButton as="fragment" let:button>
      <button data-testid="popover-button" use:button />
    </PopoverButton>
    <PopoverOverlay as="fragment" let:overlay>
      <div data-testid="popover-overlay" use:overlay />
    </PopoverOverlay>
    <PopoverPanel as="fragment" let:panel>
      <div data-testid="popover-panel" use:panel />
    </PopoverPanel>
  </Popover>
  <Popover>
    <PopoverButton as="fragment" let:button>
      <button data-testid="popover-button" use:button />
    </PopoverButton>
    <PopoverOverlay as="fragment" let:overlay>
      <div data-testid="popover-overlay" use:overlay />
    </PopoverOverlay>
    <PopoverPanel as="fragment" let:panel>
      <div data-testid="popover-panel" use:panel />
    </PopoverPanel>
  </Popover>
  <Popover {forceFocus}>
    <PopoverButton as="fragment" let:button>
      <button data-testid="popover-button" use:button />
    </PopoverButton>
    <PopoverOverlay as="fragment" let:overlay>
      <div data-testid="popover-overlay" use:overlay />
    </PopoverOverlay>
    <PopoverPanel as="fragment" let:panel>
      <div data-testid="popover-panel" use:panel />
    </PopoverPanel>
  </Popover>
</PopoverGroup>
