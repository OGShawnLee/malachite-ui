<script lang="ts">
  import type { Nullable } from '$lib/types';
  import { Menu, MenuButton, MenuItem, MenuItems } from '$lib/components';

  export let disabled: Nullable<boolean> = undefined;
  export let target: 'ACTION' | 'COMPONENT' = 'COMPONENT';
  export let handleClick = () => {};
</script>

<Menu>
  <MenuButton>Toggle</MenuButton>
  <MenuItems>
    {#if target === 'ACTION'}
      <MenuItem {disabled} as="slot" let:item on:click={handleClick}>
        <li use:item>Item</li>
      </MenuItem>
    {:else}
      <MenuItem {disabled} on:click={handleClick}>Item</MenuItem>
    {/if}
  </MenuItems>
</Menu>
