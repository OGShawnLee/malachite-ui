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
    <ToolbarLabel as="fragment" let:label>
      <label data-testid="toolbar-label" use:label />
    </ToolbarLabel>
  {/each}
  <Toolbar as="fragment" {vertical} let:toolbar>
    <div data-testid="toolbar" use:toolbar>
      <ToolbarItem as="fragment" let:item>
        <button {disabled} data-testid="toolbar-item" use:item />
      </ToolbarItem>
      <ToolbarItem as="fragment" let:item>
        <button data-testid="toolbar-item" use:item />
      </ToolbarItem>
      <ToolbarItem as="fragment" let:item>
        <button {disabled} data-testid="toolbar-item" use:item />
      </ToolbarItem>
      <ToolbarItem as="fragment" let:item>
        <button data-testid="toolbar-item" use:item />
      </ToolbarItem>
      <ToolbarItem as="fragment" let:item>
        <button {disabled} data-testid="toolbar-item" use:item />
      </ToolbarItem>
    </div>
  </Toolbar>
</ToolbarGroup>
