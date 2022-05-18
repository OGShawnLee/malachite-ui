<script lang="ts">
  import { Menu, MenuButton, MenuItem, MenuItems } from '$lib';
  import type { Forwarder, RenderElementTagName } from '$lib/types';

  interface ComponentConfig {
    as?: RenderElementTagName;
    use?: Forwarder.Actions;
    rest?: {};
  }

  export let button: ComponentConfig = {};
  export let items: ComponentConfig = {};
  export let item: ComponentConfig = {};
</script>

<Menu>
  <MenuButton data-testid="menu-button" as={button.as} use={button.use} {...button.rest}>
    Toggle
  </MenuButton>
  <MenuItems data-testid="menu-items" as={items.as} use={items.use} {...items.rest}>
    <MenuItem data-testid="menu-item" as={item.as} use={item.use} {...item.rest}>Item</MenuItem>
  </MenuItems>
</Menu>
