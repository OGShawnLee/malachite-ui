<script lang="ts">
  import type { Maybe } from '$lib/types';
  import { Toolbar, ToolbarGroup, ToolbarItem, ToolbarLabel } from '$lib';
  import { useRange } from '@test-utils';

  export let amount = useRange(1);
  export let disabled: Maybe<boolean> = undefined;
  export let vertical: Maybe<boolean> = undefined;
</script>

<ToolbarGroup data-testid="toolbar-group">
  {#each $amount as index (index)}
    <ToolbarLabel data-testid="toolbar-label" />
  {/each}
  <Toolbar {vertical} data-testid="toolbar">
    <ToolbarItem data-testid="toolbar-item" {disabled} let:isDisabled>
      <span data-testid="binding-disabled">{isDisabled}</span>
    </ToolbarItem>
    <ToolbarItem data-testid="toolbar-item" let:isDisabled>
      <span data-testid="binding-disabled">{isDisabled}</span>
    </ToolbarItem>
    <ToolbarItem data-testid="toolbar-item" {disabled} let:isDisabled>
      <span data-testid="binding-disabled">{isDisabled}</span>
    </ToolbarItem>
    <ToolbarItem data-testid="toolbar-item" let:isDisabled>
      <span data-testid="binding-disabled">{isDisabled}</span>
    </ToolbarItem>
    <ToolbarItem data-testid="toolbar-item" {disabled} let:isDisabled>
      <span data-testid="binding-disabled">{isDisabled}</span>
    </ToolbarItem>
  </Toolbar>
</ToolbarGroup>
