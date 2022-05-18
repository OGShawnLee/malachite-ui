<script lang="ts">
  import { Menu, MenuItem } from '$lib';

  export let horizontal: boolean | undefined = undefined;
  export let finite: boolean | undefined = undefined;
</script>

<button> External </button>

<Menu {finite} {horizontal} let:button let:items>
  <button use:button> Toggle </button>

  <div slot="items" use:items data-testid="menu-panel">
    <MenuItem as="slot" let:item>
      <button use:item> Item 1 </button>
    </MenuItem>
    <MenuItem as="slot" let:item>
      <button use:item> Item 2 </button>
    </MenuItem>
    <MenuItem as="slot" let:item>
      <button use:item> Item 3 </button>
    </MenuItem>
    <MenuItem as="slot" let:item>
      <button use:item> Item 3 </button>
    </MenuItem>
  </div>
</Menu>
