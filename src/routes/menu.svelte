<script lang="ts">
  import { Menu, MenuButton, MenuItem, MenuItems } from '$lib';
  import { useToggle } from '@test-utils';
  import { fade, slide } from 'svelte/transition';

  const [finite, toggleFinite] = useToggle();
  const [horizontal, toggleHorizontal] = useToggle(true);
  const [disabled, toggleDisabled] = useToggle(true);

  function handleClick(this: HTMLElement) {
    alert(this.textContent);
  }
</script>

<svelte:head>
  <title>Malachite UI | Menu</title>
</svelte:head>

<main class="md:max-w-4xl xl:max-w-6xl mx-auto py-12 | grid gap-12">
  <h1 class="text-6xl font-bold">Menu</h1>

  <div class="grid gap-24">
    <Menu class="grid gap-10" as="section" {finite}>
      <header class="flex items-center gap-8">
        <button
          class="px-6 py-2 | rounded-md ring-2 {$finite
            ? 'ring-green-400'
            : 'ring-neutral-400'} font-medium"
          on:click={toggleFinite}
          aria-label="Toggle Finite Navigation"
        >
          Toggle
        </button>
        <h2 class="text-3xl font-bold">Finite Navigation</h2>
      </header>
      <MenuButton
        class={{
          base: 'max-w-[fit-content] px-6 py-2 | rounded-md font-medium ring-2',
          open: { on: 'ring-green-400', off: 'ring-neutral-200' }
        }}
      >
        Toggle
      </MenuButton>
      <MenuItems class="max-w-sm | flex flex-col gap-3 | outline-none">
        <MenuItem
          class={{
            base: 'px-6 py-2 | rounded ring-2 font-medium cursor-pointer shadow-md',
            selected: { on: 'ring-cyan-400 bg-cyan-400 text-white', off: 'ring-neutral-200' }
          }}
          on:click={handleClick}
        >
          Activate
        </MenuItem>
        <MenuItem
          class={{
            base: 'px-6 py-2 | rounded ring-2 font-medium cursor-pointer shadow-md',
            selected: { on: 'ring-cyan-400 bg-cyan-400 text-white', off: 'ring-neutral-200' }
          }}
          on:click={handleClick}
        >
          Edit
        </MenuItem>
        <MenuItem
          class={{
            base: 'px-6 py-2 | rounded ring-2 font-medium cursor-pointer shadow-md',
            selected: { on: 'ring-cyan-400 bg-cyan-400 text-white', off: 'ring-neutral-200' }
          }}
          on:click={handleClick}
        >
          Share
        </MenuItem>
      </MenuItems>
    </Menu>
    <Menu class="grid gap-10" as="section" {horizontal} let:isOpen let:items>
      <header class="flex items-center gap-8">
        <button
          class="px-6 py-2 | rounded-md ring-2 {$horizontal
            ? 'ring-green-400'
            : 'ring-neutral-400'} font-medium"
          on:click={toggleHorizontal}
          aria-label="Toggle Finite Navigation"
        >
          Toggle
        </button>
        <h2 class="text-3xl font-bold">Horizontal Navigation</h2>
      </header>
      <div class="flex items-start gap-10" class:flex-col={!$horizontal}>
        <MenuButton
          class={{
            base: 'max-w-[fit-content] px-6 py-2 | rounded-md font-medium ring-2',
            open: { on: 'ring-green-400', off: 'ring-neutral-200' }
          }}
        >
          Toggle
        </MenuButton>
        {#if isOpen}
          <ul
            class="min-w-sm | flex gap-3 | outline-none"
            class:flex-col={!$horizontal}
            use:items
            transition:fade
          >
            <MenuItem
              class={{
                base: 'px-6 py-2 | rounded ring-2 font-medium cursor-pointer shadow-md',
                selected: { on: 'ring-cyan-400 bg-cyan-400 text-white', off: 'ring-neutral-200' }
              }}
            >
              Activate
            </MenuItem>
            <MenuItem
              class={{
                base: 'px-6 py-2 | rounded ring-2 font-medium cursor-pointer shadow-md',
                selected: { on: 'ring-cyan-400 bg-cyan-400 text-white', off: 'ring-neutral-200' }
              }}
            >
              Edit
            </MenuItem>
            <MenuItem
              class={{
                base: 'px-6 py-2 | rounded ring-2 font-medium cursor-pointer shadow-md',
                selected: { on: 'ring-cyan-400 bg-cyan-400 text-white', off: 'ring-neutral-200' }
              }}
            >
              Share
            </MenuItem>
          </ul>
        {/if}
      </div>
    </Menu>
    <Menu class="grid gap-10" as="section" let:items>
      <header class="flex items-center gap-8">
        <button
          class="px-6 py-2 | rounded-md ring-2 {$disabled
            ? 'ring-green-400'
            : 'ring-neutral-400'} font-medium"
          on:click={toggleDisabled}
          aria-label="Toggle Finite Navigation"
        >
          Toggle
        </button>
        <div>
          <h2 class="text-3xl font-bold">Navigation with Disabled Items</h2>
          <p class="text-sm font-medium opacity-50">
            Disabled elements should be skipped and not trigger click events and
          </p>
        </div>
      </header>
      <MenuButton
        class={{
          base: 'max-w-[fit-content] px-6 py-2 | rounded-md font-medium ring-2',
          open: { on: 'ring-green-400', off: 'ring-neutral-200' }
        }}
      >
        Toggle
      </MenuButton>
      <ul
        class="max-w-sm | flex flex-col gap-3 | outline-none"
        slot="items"
        use:items
        transition:slide
      >
        <MenuItem
          class={{
            base: 'px-6 py-2 | rounded ring-2 font-medium cursor-pointer shadow-md',
            selected: { on: 'ring-cyan-400 bg-cyan-400 text-white', off: 'ring-neutral-200' },
            disabled: 'opacity-50 ring-neutral-200'
          }}
          disabled={$disabled}
          on:click={handleClick}
        >
          Activate
        </MenuItem>
        <MenuItem
          class={{
            base: 'px-6 py-2 | rounded ring-2 font-medium cursor-pointer shadow-md',
            selected: { on: 'ring-cyan-400 bg-cyan-400 text-white', off: 'ring-neutral-200' }
          }}
          on:click={handleClick}
        >
          Edit
        </MenuItem>
        <MenuItem
          class={{
            base: 'px-6 py-2 | rounded ring-2 font-medium cursor-pointer shadow-md',
            selected: { on: 'ring-cyan-400 bg-cyan-400 text-white', off: 'ring-neutral-200' },
            disabled: 'opacity-50 ring-neutral-200'
          }}
          disabled={$disabled}
          on:click={handleClick}
        >
          Delete
        </MenuItem>
        <MenuItem
          class={{
            base: 'px-6 py-2 | rounded ring-2 font-medium cursor-pointer shadow-md',
            selected: { on: 'ring-cyan-400 bg-cyan-400 text-white', off: 'ring-neutral-200' }
          }}
          on:click={handleClick}
        >
          Share
        </MenuItem>
        <MenuItem
          class={{
            base: 'px-6 py-2 | rounded ring-2 font-medium cursor-pointer shadow-md',
            selected: { on: 'ring-cyan-400 bg-cyan-400 text-white', off: 'ring-neutral-200' },
            disabled: 'opacity-50 ring-neutral-200'
          }}
          disabled={$disabled}
          on:click={handleClick}
        >
          Tweet
        </MenuItem>
      </ul>
    </Menu>
  </div>
</main>
