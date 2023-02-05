<script lang="ts">
  import { Menu, MenuButton, MenuItem, MenuItems } from '$lib';
  import { slide } from 'svelte/transition';
  import { useClassNameResolver } from '$lib/hooks';

  const buttonClassName = useClassNameResolver<'OPEN'>({
    base: 'px-6 py-1.75 | border-2 border-transparent rounded-lg outline-none focus:(text-white border-white) hover:text-white',
    open: 'text-white'
  });
  const className = useClassNameResolver<'ACTIVE' | 'DISABLED'>({
    base: 'px-6 py-2 | flex items-center gap-1.75 | text-sm text-light text-left',
    disabled: 'opacity-50',
    active: 'bg-neutral-600 text-white'
  });
</script>

<header class="fixed top-0 inset-x-0 z-90 h-16 | md:h-24 lg:static">
  <div class="w-full h-full mx-auto px-4 | layout-length | flex items-center gap-12 | lg:px-0">
    <div>
      <a class="font-bold font-poppins text-2xl text-white md:text-4xl" href="/"> Malachite </a>
    </div>
    <nav class="w-full | flex items-center justify-between">
      <Menu class="relative" infinite>
        <MenuButton class={buttonClassName}>Components</MenuButton>
        <div class="absolute top-12 z-10" slot="items" transition:slide|local>
          <MenuItems class="w-40 | grid | bg-neutral-800 outline-none" static>
            <MenuItem class={className} as="a" href="/accordion">Accordion</MenuItem>
            <MenuItem class={className} as="a" href="/dialog">Dialog</MenuItem>
            <MenuItem class={className} as="a" href="/disclosure">Disclosure</MenuItem>
            <MenuItem class={className} as="a" href="/menu">Menu</MenuItem>
            <MenuItem class={className} as="a" href="/navigable">Navigable</MenuItem>
            <MenuItem class={className} as="a" href="/popover">Popover</MenuItem>
            <MenuItem class={className} as="a" href="/tabs">Tabs</MenuItem>
          </MenuItems>
        </div>
      </Menu>
      <a
        class="focus:text-white hover:text-white"
        href="https://github.com/OGShawnLee/malachite-ui"
        target="__blank"
      >
        <span class="sr-only">View Project Repository on GitHub</span>
        <i class="bx bxl-github text-2xl" />
      </a>
    </nav>
  </div>
</header>
