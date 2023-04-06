<script lang="ts">
  import type { Maybe } from '$lib/types';
  import { Menu, MenuItem } from '$lib';

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

<Menu {infinite} {horizontal} let:button let:items let:isOpen>
  <button data-testid="menu-button" use:button>
    Toggle
    <span data-testid="binding-open-button"> {isOpen} </span>
  </button>
  <svelte:fragment slot="items">
    {#if isShowingPanel}
      <div data-testid="menu-panel" use:items>
        <MenuItem as="fragment" let:item let:isActive>
          <button data-testid="menu-item" on:click={handleClick} {disabled} use:item>
            1 <span data-testid="binding-active"> {isActive} </span>
          </button>
        </MenuItem>
        <MenuItem as="fragment" let:item let:isActive>
          <button data-testid="menu-item" on:click={handleClick} use:item>
            2 <span data-testid="binding-active"> {isActive} </span>
          </button>
        </MenuItem>
        <MenuItem as="fragment" let:item let:isActive>
          <button data-testid="menu-item" on:click={handleClick} {disabled} use:item>
            3 <span data-testid="binding-active"> {isActive} </span>
          </button>
        </MenuItem>
        <MenuItem as="fragment" let:item let:isActive>
          <button data-testid="menu-item" on:click={handleClick} use:item>
            4 <span data-testid="binding-active"> {isActive} </span>
          </button>
        </MenuItem>
        <MenuItem as="fragment" let:item let:isActive>
          <button data-testid="menu-item" on:click={handleClick} {disabled} use:item>
            5 <span data-testid="binding-active"> {isActive} </span>
          </button>
        </MenuItem>
        <MenuItem as="fragment" let:item let:isActive>
          <button data-testid="menu-item" on:click={handleClick} use:item>
            6 <span data-testid="binding-active"> {isActive} </span>
          </button>
        </MenuItem>
      </div>
    {/if}
  </svelte:fragment>
</Menu>
