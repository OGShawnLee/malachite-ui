<script lang="ts">
  import type { Nullable } from '$lib/types';
  import { Page } from '@app/layout';
  import { Toggle } from '@app/components';
  import { Menu, MenuButton, MenuItem, MenuItems } from '$lib';
  import { useClassNameResolver } from '$lib/hooks';
  import { fade, fly, slide } from 'svelte/transition';

  const className = useClassNameResolver<'ACTIVE' | 'DISABLED'>({
    base: 'px-4 py-2 | flex items-center gap-1.75 | text-left text-sm',
    disabled: 'opacity-50',
    active: 'text-white font-medium'
  });

  let horizontal = false;
  let infinite = false;
  let nofocus = false;
  let option: Nullable<string>;

  function handleClick(this: HTMLElement) {
    option = this.textContent;
  }
</script>

<Page title="Menu">
  <div class="flex items-center gap-3" slot="options">
    <Toggle text="Toggle Infinite" bind:checked={infinite} />
    <Toggle text="Toggle Horizontal" bind:checked={horizontal} />
    <Toggle text="Toggle Horizontal" bind:checked={horizontal} />
    <Toggle text="Toggle Button onClose Focus" bind:checked={nofocus} /> 
  </div>
  <output class="max-w-fit px-6 py-2 | bg-neutral-800">
    {option ? `You've clicked: ${option}` : 'Click an Option'}
  </output>
  <div class="grid grid-cols-4 gap-6">
    <Menu class="flex flex-col items-start gap-3" {horizontal} {infinite} let:items>
      <MenuButton class={{ base: 'button button--medium', open: 'text-white' }} {nofocus} use={[console.log]}>
        Options
      </MenuButton>
      <div
        class="w-40 | flex flex-col | bg-neutral-800 outline-none"
        slot="items"
        use:items
        transition:slide|local
      >
        <MenuItem class={className} on:click={handleClick} let:isActive>
          <i class="bx bx-archive" class:text-green-400={isActive} />
          Archive
        </MenuItem>
        <div class="w-full h-0.5 | bg-neutral-700/80" aria-hidden role="separator" />
        <MenuItem class={className} on:click={handleClick} let:isActive>
          <i class="bx bx-trash" class:text-green-400={isActive} />
          Delete
        </MenuItem>
        <div class="w-full h-0.5 | bg-neutral-700/80" aria-hidden role="separator" />
        <MenuItem class={className} on:click={handleClick} let:isActive>
          <i class="bx bx-pen" class:text-green-400={isActive} />
          Edit
        </MenuItem>
        <div class="w-full h-0.5 | bg-neutral-700/80" aria-hidden role="separator" />
        <MenuItem class={className} on:click={handleClick} let:isActive>
          <i class="bx bx-duplicate" class:text-green-400={isActive} />
          Duplicate
        </MenuItem>
      </div>
    </Menu>
    <Menu class="flex flex-col items-start gap-3" {horizontal} {infinite}>
      <MenuButton class={{ base: 'button button--medium', open: 'text-white' }} {nofocus}>Options</MenuButton>
      <MenuItems class="w-40 | flex flex-col | bg-neutral-800 outline-none">
        <MenuItem class={className} on:click={handleClick} let:isActive>
          <i class="bx bx-archive" class:text-green-400={isActive} />
          Archive
        </MenuItem>
        <div class="w-full h-0.5 | bg-neutral-700/80" aria-hidden role="separator" />
        <MenuItem class={className} on:click={handleClick} let:isActive>
          <i class="bx bx-trash" class:text-green-400={isActive} />
          Delete
        </MenuItem>
        <div class="w-full h-0.5 | bg-neutral-700/80" aria-hidden role="separator" />
        <MenuItem class={className} on:click={handleClick} let:isActive>
          <i class="bx bx-pen" class:text-green-400={isActive} />
          Edit
        </MenuItem>
        <div class="w-full h-0.5 | bg-neutral-700/80" aria-hidden role="separator" />
        <MenuItem class={className} on:click={handleClick} let:isActive>
          <i class="bx bx-duplicate" class:text-green-400={isActive} />
          Duplicate
        </MenuItem>
      </MenuItems>
    </Menu>
    <Menu class="flex flex-col items-start gap-3" {horizontal} {infinite}>
      <MenuButton class={{ base: 'button button--medium', open: 'text-white' }} {nofocus}>Options</MenuButton>
      <div slot="items" transition:fly|local={{ y: 15 }}>
        <MenuItems class="w-40 | grid | bg-neutral-800 outline-none" static>
          <MenuItem class={className} on:click={handleClick} let:isActive>
            <i class="bx bx-archive" class:text-green-400={isActive} />
            Archive
          </MenuItem>
          <div class="w-full h-0.5 | bg-neutral-700/80" aria-hidden role="separator" />
          <MenuItem class={className} on:click={handleClick} disabled>
            <i class="bx bx-trash" />
            Delete
          </MenuItem>
          <div class="w-full h-0.5 | bg-neutral-700/80" aria-hidden role="separator" />
          <MenuItem class={className} on:click={handleClick} let:isActive>
            <i class="bx bx-pen" class:text-green-400={isActive} />
            Edit
          </MenuItem>
          <div class="w-full h-0.5 | bg-neutral-700/80" aria-hidden role="separator" />
          <MenuItem class={className} on:click={handleClick} let:isActive>
            <i class="bx bx-duplicate" class:text-green-400={isActive} />
            Duplicate
          </MenuItem>
        </MenuItems>
      </div>
    </Menu>
    <Menu class="flex flex-col items-start gap-3" {horizontal} {infinite}>
      <MenuButton class={{ base: 'button button--medium', open: 'text-white' }} {nofocus}>Options</MenuButton>
      <div slot="items" transition:fade>
        <MenuItems class="w-40 | grid | bg-neutral-800 outline-none" static>
          <MenuItem class={className} on:click={handleClick} let:isActive>
            <i class="bx bx-archive" class:text-green-400={isActive} />
            Archive
          </MenuItem>
          <div class="w-full h-0.5 | bg-neutral-700/80" aria-hidden role="separator" />
          <MenuItem class={className} on:click={handleClick} disabled>
            <i class="bx bx-trash" />
            Delete
          </MenuItem>
          <div class="w-full h-0.5 | bg-neutral-700/80" aria-hidden role="separator" />
          <MenuItem class={className} on:click={handleClick} let:isActive>
            <i class="bx bx-pen" class:text-green-400={isActive} />
            Edit
          </MenuItem>
          <div class="w-full h-0.5 | bg-neutral-700/80" aria-hidden role="separator" />
          <MenuItem class={className} on:click={handleClick} disabled>
            <i class="bx bx-duplicate" />
            Duplicate
          </MenuItem>
        </MenuItems>
      </div>
    </Menu>
  </div>
</Page>
