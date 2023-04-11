<script lang="ts">
  import type { Maybe } from '$lib/types';
  import { Popover, PopoverGroup } from '$lib';

  export let forceFocus: Maybe<boolean> = undefined;
</script>

<PopoverGroup let:isOpen>
  <span data-testid="binding-open-group">{isOpen}</span>
  <Popover let:button let:panel let:overlay>
    <button data-testid="popover-button" use:button />
    <div data-testid="popover-overlay" slot="overlay" use:overlay />
    <div data-testid="popover-panel" slot="panel" use:panel />
  </Popover>
  <Popover let:button let:panel let:overlay>
    <button data-testid="popover-button" use:button />
    <div data-testid="popover-overlay" slot="overlay" use:overlay />
    <div data-testid="popover-panel" slot="panel" use:panel />
  </Popover>
  <Popover {forceFocus} let:button let:panel let:overlay>
    <button data-testid="popover-button" use:button />
    <div data-testid="popover-overlay" slot="overlay" use:overlay />
    <div data-testid="popover-panel" slot="panel" use:panel />
  </Popover>
</PopoverGroup>
