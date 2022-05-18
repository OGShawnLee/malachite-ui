<script lang="ts">
  import { Menu, MenuButton, MenuItems, MenuItem } from '$lib';

  export let horizontal: boolean | undefined = undefined;
  export let finite: boolean | undefined = undefined;
</script>

<button>External</button>

<Menu {horizontal} {finite}>
  <MenuButton>Toggle</MenuButton>
  <MenuItems data-testid="menu-panel">
    <MenuItem disabled>Item 1</MenuItem>
    <MenuItem>Item 2</MenuItem>
    <MenuItem disabled>Item 3</MenuItem>
    <MenuItem disabled>Item 4</MenuItem>
    <MenuItem>Item 5</MenuItem>
    <MenuItem>Item 6</MenuItem>
    <MenuItem disabled>Item 7</MenuItem>
  </MenuItems>
</Menu>
