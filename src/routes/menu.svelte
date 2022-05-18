<script lang="ts">
  import { Menu, MenuButton, MenuItem, MenuItems } from '$lib';
  import { useClassNameResolver } from '$lib/hooks';
  import { useToggle } from '@test-utils';
  import { fade } from 'svelte/transition';

  const [horizontal, toggleHorizontal] = useToggle(false);
  const [finite, toggleFinite] = useToggle(true);

  let primitiveHorizontal = false;
  function togglePrimitiveHorizontal() {
    primitiveHorizontal = !primitiveHorizontal;
  }

  function doSuff(this: HTMLElement) {
    console.log(this.textContent);
  }

  const className = useClassNameResolver<'isDisabled' | 'isSelected'>({
    base: 'px-6 py-2 cursor-pointer',
    disabled: 'opacity-40',
    selected: 'bg-cyan-400'
  });
</script>

<button class="px-6 py-2 font-medium" on:click={toggleHorizontal}>
  Toggle Horizontal {$horizontal}
</button>
<button class="px-6 py-2 font-medium" on:click={toggleFinite}>
  Toggle Finite {$finite}
</button>

<Menu as="div" class="flex flex-col gap-6" {horizontal} {finite}>
  <MenuButton class={{ base: 'px-6 py-2 font-medium', open: 'bg-cyan-200' }}>Toggle</MenuButton>
  <MenuItems class="flex flex-col gap-3">
    <MenuItem class={className} on:click={doSuff}>Activate</MenuItem>
    <MenuItem class={className} disabled on:click={doSuff}>Delete</MenuItem>
    <MenuItem class={className} on:click={doSuff}>Edit</MenuItem>
    <MenuItem class={className} disabled on:click={doSuff}>Nuke</MenuItem>
  </MenuItems>
</Menu>

<button class="px-6 py-2 font-medium" on:click={togglePrimitiveHorizontal}>
  Toggle Horizontal {primitiveHorizontal}
</button>
<Menu as="div" class="flex flex-col gap-6" horizontal={primitiveHorizontal} let:items>
  <MenuButton
    class={{ base: 'px-6 py-2 font-medium', open: { on: 'bg-cyan-200', off: 'bg-gray-300' } }}
  >
    Toggle
  </MenuButton>
  <div slot="items" class="flex flex-col gap-3" use:items transition:fade>
    <MenuItem class={className} disabled let:isSelected>
      Activate {isSelected}
    </MenuItem>
    <MenuItem
      class={({ isSelected }) => `px-6 py-2 font-medium ${isSelected ? 'bg-red-400' : ''}`}
      let:isSelected
    >
      Delete {isSelected}
    </MenuItem>
    <MenuItem
      class={({ isSelected }) => `px-6 py-2 font-medium ${isSelected ? 'bg-cyan-400' : ''}`}
      let:isSelected
    >
      Edit {isSelected}
    </MenuItem>
    <MenuItem class={className} disabled let:isSelected>
      Nuke {isSelected}
    </MenuItem>
  </div>
</Menu>

<Menu as="div" class="flex gap-6" horizontal let:button>
  <button class="px-6 py-2 font-medium" use:button>Toggle</button>
  <MenuItems class="flex gap-3">
    <MenuItem class="px-6 py-2 font-medium opacity-40" disabled let:isSelected>
      Activate {isSelected}
    </MenuItem>
    <MenuItem class="px-6 py-2 font-medium" let:isSelected>
      Delete {isSelected}
    </MenuItem>
    <MenuItem class="px-6 py-2 font-medium" let:isSelected>
      Edit {isSelected}
    </MenuItem>
    <MenuItem class="px-6 py-2 font-medium opacity-40" disabled let:isSelected>
      Nuke {isSelected}
    </MenuItem>
  </MenuItems>
</Menu>

<Menu as="div" class="flex flex-col gap-6">
  <MenuButton class="px-6 py-2 font-medium">Toggle</MenuButton>
  <MenuItems class="flex flex-col gap-3">
    <MenuItem as="button" class="px-6 py-2 font-medium">Activate</MenuItem>
    <MenuItem as="button" class="px-6 py-2 font-medium">Delete</MenuItem>
    <MenuItem as="button" class="px-6 py-2 font-medium">Update</MenuItem>
  </MenuItems>
</Menu>

<Menu as="div" class="flex flex-col gap-6" finite>
  <MenuButton class="px-6 py-2 font-medium">Toggle</MenuButton>
  <MenuItems class="flex flex-col gap-3">
    <MenuItem as="button" class="px-6 py-2 font-medium" disabled>Activate</MenuItem>
    <MenuItem as="button" class="px-6 py-2 font-medium" let:isSelected>
      Edit {isSelected}
    </MenuItem>
    <MenuItem as="button" class="px-6 py-2 font-medium" let:isSelected>
      Delete {isSelected}
    </MenuItem>
    <MenuItem as="button" class="px-6 py-2 font-medium" disabled>Update</MenuItem>
  </MenuItems>
</Menu>

<Menu>
  <MenuButton class="px-6 py-2 font-medium">Toggle</MenuButton>
  <MenuItems data-testid="menu-panel">
    <MenuItem disabled let:isSelected>
      A Item <span> {isSelected} </span>
    </MenuItem>
    <MenuItem let:isSelected>
      B Item <span> {isSelected} </span>
    </MenuItem>
    <MenuItem disabled let:isSelected>
      C Item <span> {isSelected} </span>
    </MenuItem>
    <MenuItem disabled let:isSelected>
      D Item <span> {isSelected} </span>
    </MenuItem>
    <MenuItem let:isSelected>
      E Item <span> {isSelected} </span>
    </MenuItem>
    <MenuItem let:isSelected>
      F Item <span> {isSelected} </span>
    </MenuItem>
    <MenuItem disabled let:isSelected>
      G Item <span> {isSelected} </span>
    </MenuItem>
  </MenuItems>
</Menu>

<div class="h-[1000px]" />

<style>
  :global(button:focus) {
    background-color: hsl(0, 0%, 90%);
  }
</style>
