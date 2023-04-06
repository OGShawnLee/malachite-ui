<script lang="ts">
  import type { Maybe } from '$lib/types';
  import { Menu, MenuButton, MenuItem, MenuItems } from '$lib';

  export let buttonid: Maybe<string> = undefined;
  export let disabled: Maybe<boolean> = undefined;
  export let infinite: Maybe<boolean> = undefined;
  export let horizontal: Maybe<boolean> = undefined;
  export let panelid: Maybe<string> = undefined;
  export let isShowingPanel = true;
  export let onClick: (id: string) => void = () => {};

  function handleClick(this: HTMLElement) {
    onClick(this.id)
  }
</script>

<button> External </button>

<Menu {infinite} {horizontal}>
  <MenuButton data-testid="menu-button" id={buttonid} let:isOpen>
    Toggle
    <span data-testid="binding-open-button"> {isOpen} </span>
  </MenuButton>
  {#if isShowingPanel}
    <MenuItems data-testid="menu-panel" id={panelid}>
      <MenuItem data-testid="menu-item" on:click={handleClick} {disabled} let:isActive>
        1 <span data-testid="binding-active"> {isActive} </span>
      </MenuItem>
      <MenuItem data-testid="menu-item" on:click={handleClick} let:isActive>
        2 <span data-testid="binding-active"> {isActive} </span>
      </MenuItem>
      <MenuItem data-testid="menu-item" on:click={handleClick} {disabled} let:isActive>
        3 <span data-testid="binding-active"> {isActive} </span>
      </MenuItem>
      <MenuItem data-testid="menu-item" on:click={handleClick} let:isActive>
        4 <span data-testid="binding-active"> {isActive} </span>
      </MenuItem>
      <MenuItem data-testid="menu-item" on:click={handleClick} {disabled} let:isActive>
        5 <span data-testid="binding-active"> {isActive} </span>
      </MenuItem>
      <MenuItem data-testid="menu-item" on:click={handleClick} let:isActive>
        6 <span data-testid="binding-active"> {isActive} </span>
      </MenuItem>
    </MenuItems>
  {/if}
</Menu>
