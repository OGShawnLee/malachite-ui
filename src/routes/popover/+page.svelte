<script>
  import { Popover, PopoverButton, PopoverOverlay, PopoverPanel } from '$lib/components';
  import { fade, fly, scale, slide } from 'svelte/transition';
  import { sineOut } from 'svelte/easing';
  import { useToggle } from '@test-utils';

  const [forceFocus, toggleForceFocus] = useToggle(false);
</script>

<main class="md:max-w-4xl xl:max-w-6xl mx-auto py-12 | grid gap-12">
  <h1 class="text-6xl font-bold">Popover</h1>

  <div class="grid gap-24">
    <section class="grid gap-10">
      <header class="flex items-center gap-8">
        <button
          class="px-6 py-2 | rounded-md ring-2 {$forceFocus
            ? 'ring-green-400'
            : 'ring-neutral-400'} font-medium"
          on:click={toggleForceFocus}
          aria-label="Toggle Finite Navigation"
        >
          Toggle
        </button>
        <h2 class="text-3xl font-bold">Force Focus</h2>
      </header>
      <div class="grid grid-cols-4 items-start gap-12">
        <!-- Action Component -->
        <Popover class="grid gap-9" {forceFocus} let:isOpen let:button let:panel let:close>
          <button
            class="max-w-[fit-content] px-6 py-2 | font-medium rounded-md ring-2 {isOpen
              ? 'ring-sky-500'
              : 'ring-neutral-500'}"
            use:button
          >
            Toggle
          </button>
          <!-- WE HAVE FULL CONTROL OVER TRANSITIONS -->
          <div class="max-w-xs p-4 | grid gap-3" slot="panel" use:panel transition:fade|local>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, fugit. Officiis,
              repellat!
            </p>
            <div class="flex gap-3">
              <button class="px-6 py-2 font-medium" on:click={close}>Close Me</button>
              <a class="block px-6 py-2 font-medium" href="/"> Home </a>
            </div>
          </div>
        </Popover>
        <Popover class="grid gap-9" {forceFocus} let:isOpen let:button let:panel let:close>
          <PopoverButton
            class={{
              base: 'max-w-[fit-content] px-6 py-2 | font-medium rounded-md ring-2 {isOpen',
              open: { on: 'ring-sky-500', off: 'ring-neutral-500' }
            }}
          >
            Toggle
          </PopoverButton>
          <PopoverPanel class="max-w-xs p-4 | grid gap-3">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, fugit. Officiis,
              repellat!
            </p>
            <div class="flex gap-3">
              <button class="px-6 py-2 font-medium" on:click={close}>Close Me</button>
              <a class="block px-6 py-2 font-medium" href="/"> Home </a>
            </div>
          </PopoverPanel>
        </Popover>
        <!-- With Overlay -->
        <Popover class="grid gap-9" {forceFocus} let:isOpen let:overlay let:panel>
          <PopoverButton
            class={{
              base: 'max-w-[fit-content] px-6 py-2 | font-medium rounded-md ring-2',
              open: { on: 'ring-sky-500', off: 'ring-neutral-500' }
            }}
          >
            Toggle
          </PopoverButton>
          <div
            class="fixed inset-0 bg-neutral-900/80 backdrop-filter backdrop-blur-1px"
            slot="overlay"
            transition:fade
          />
          <!-- WE HAVE FULL CONTROL OVER TRANSITIONS -->
          <div
            class="fixed absolute-center z-10 max-w-sm p-8 | grid gap-3 | bg-white rounded-md"
            slot="panel"
            use:panel
            transition:scale|local={{ start: 1.5, easing: sineOut }}
            let:close
          >
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, fugit. Officiis,
              repellat!
            </p>
            <div class="flex gap-3">
              <button class="px-6 py-2 font-medium" on:click={close}>Close Me</button>
              <a class="block px-6 py-2 font-medium" href="/"> Home </a>
            </div>
          </div>
        </Popover>
        <Popover class="grid gap-9" {forceFocus} let:isOpen let:close>
          <PopoverButton
            class={{
              base: 'max-w-[fit-content] px-6 py-2 | font-medium rounded-md ring-2',
              open: { on: 'ring-sky-500', off: 'ring-neutral-500' }
            }}
          >
            Toggle
          </PopoverButton>
          <PopoverOverlay
            class="fixed inset-0 bg-neutral-900/80 backdrop-filter backdrop-blur-1px"
          />
          <!-- WE HAVE FULL CONTROL OVER TRANSITIONS -->
          <PopoverPanel
            class="fixed absolute-center z-10 max-w-sm p-8 | grid gap-3 | bg-white rounded-md"
          >
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, fugit. Officiis,
              repellat!
            </p>
            <div class="flex gap-3">
              <button class="px-6 py-2 font-medium" on:click={close}>Close Me</button>
              <a class="block px-6 py-2 font-medium" href="/"> Home </a>
            </div>
          </PopoverPanel>
        </Popover>
      </div>
    </section>
  </div>
</main>

<style>
  :global(.absolute-center) {
    @apply top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2;
  }
</style>
