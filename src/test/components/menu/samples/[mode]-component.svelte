<script lang="ts">
  import { Menu, MenuButton, MenuItems, MenuItem } from '$lib';

  export let showPanel = true;
  export let horizontal: boolean | undefined = undefined;
  export let finite: boolean | undefined = undefined;
</script>

<button> External </button>

<Menu {horizontal} {finite} let:isOpen>
  <span data-testid="global-isOpen">
    {isOpen}
  </span>
  <MenuButton let:isOpen>
    Toggle
    <span data-testid="button-isOpen">
      {isOpen}
    </span>
  </MenuButton>
  {#if showPanel}
    <MenuItems data-testid="menu-panel">
      <MenuItem let:isSelected>
        Item 1
        <span data-testid="isSelected-holder">
          {isSelected}
        </span>
      </MenuItem>
      <MenuItem let:isSelected>
        Item 2
        <span data-testid="isSelected-holder">
          {isSelected}
        </span>
      </MenuItem>
      <MenuItem let:isSelected>
        Item 3
        <span data-testid="isSelected-holder">
          {isSelected}
        </span>
      </MenuItem>
      <MenuItem let:isSelected>
        Item 4
        <span data-testid="isSelected-holder">
          {isSelected}
        </span>
      </MenuItem>
    </MenuItems>
  {/if}
</Menu>
