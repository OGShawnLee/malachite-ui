<script lang="ts">
  import type { Action, RenderElementTagName } from '$lib/types';
  import { Toolbar, ToolbarGroup, ToolbarItem, ToolbarLabel } from '$lib';

  interface ComponentConfig {
    as?: RenderElementTagName;
    use?: Action[];
    rest?: {};
  }

  export let item: ComponentConfig = {};
  export let label: ComponentConfig = {};
  export let toolbar: ComponentConfig = {};
</script>

<ToolbarGroup>
  <ToolbarLabel as={label.as} use={label.use} {...label.rest} data-testid="toolbar-label" />
  <Toolbar as={toolbar.as} use={toolbar.use} {...toolbar.rest} data-testid="toolbar-toolbar">
    <ToolbarItem as={item.as} use={item.use} {...item.rest} data-testid="toolbar-item" />
  </Toolbar>
</ToolbarGroup>
