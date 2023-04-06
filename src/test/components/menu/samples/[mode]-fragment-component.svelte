<script lang="ts">
  import type { Maybe } from '$lib/types';
  import { Menu, MenuButton, MenuItems, MenuItem } from '$lib';

  export let disabled: Maybe<boolean> = undefined;
  export let infinite: Maybe<boolean> = undefined;
  export let horizontal: Maybe<boolean> = undefined;
  export let isShowingPanel = true;
  export let onClick: (id: string) => void = () => {};

  function handleClick(this: HTMLElement) {
    onClick(this.id);
  }
</script>

<button> External </button>

<Menu {infinite} {horizontal} let:isOpen>
  <MenuButton as="fragment" let:button>
    <button data-testid="menu-button" use:button>
      Toggle
      <span data-testid="binding-open-button"> {isOpen} </span>
    </button>
  </MenuButton>
  {#if isShowingPanel}
    <MenuItems data-testid="menu-panel">
      <MenuItem as="fragment" let:item let:isActive>
        expect(panel).toHaveFocus();
        <button data-testid="menu-item" on:click={handleClick} {disabled} use:item>
          1 <span data-testid="binding-active"> {isActive} </span>
        </button>
      </MenuItem>
      <MenuItem as="fragment" let:item let:isActive>
        expect(panel).toHaveFocus();
        <button data-testid="menu-item" on:click={handleClick} use:item>
          2 <span data-testid="binding-active"> {isActive} </span>
        </button>
      </MenuItem>
      <MenuItem as="fragment" let:item let:isActive>
        expect(panel).toHaveFocus();
        <button data-testid="menu-item" on:click={handleClick} {disabled} use:item>
          3 <span data-testid="binding-active"> {isActive} </span>
        </button>
      </MenuItem>
      <MenuItem as="fragment" let:item let:isActive>
        expect(panel).toHaveFocus();
        <button data-testid="menu-item" on:click={handleClick} use:item>
          4 <span data-testid="binding-active"> {isActive} </span>
        </button>
      </MenuItem>
      <MenuItem as="fragment" let:item let:isActive>
        expect(panel).toHaveFocus();
        <button data-testid="menu-item" on:click={handleClick} {disabled} use:item>
          5 <span data-testid="binding-active"> {isActive} </span>
        </button>
      </MenuItem>
      <MenuItem as="fragment" let:item let:isActive>
        expect(panel).toHaveFocus();
        <button data-testid="menu-item" on:click={handleClick} use:item>
          6 <span data-testid="binding-active"> {isActive} </span>
        </button>
      </MenuItem>
    </MenuItems>
  {/if}
</Menu>
