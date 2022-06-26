<script>
  import { Disclosure, DisclosureButton, DisclosurePanel } from '$lib/components';
  import { useToggle } from '@test-utils';
  import { fade, fly, scale, slide } from 'svelte/transition';

  const [open, toggleOpen] = useToggle(false);
  let isOpen = false;

  function togglePrimitive() {
    isOpen = !isOpen;
  }
</script>

<main class="md:max-w-4xl xl:max-w-6xl mx-auto py-12 | grid gap-12">
  <h1 class="text-6xl font-bold">Disclosure</h1>
  <div class="grid gap-24">
    <section class="grid gap-10">
      <header class="flex items-center gap-8">
        <button
          class="px-6 py-2 | rounded-md ring-2 {$open
            ? 'ring-green-400'
            : 'ring-neutral-400'} font-medium"
          on:click={toggleOpen}
          aria-label="Toggle Vertical Navigation"
        >
          Toggle
        </button>
        <div>
          <h2 class="text-3xl font-bold">Open Store</h2>
          <p class="text-sm font-medium opacity-50">Should be possible to pass a writable store</p>
        </div>
      </header>
      <div class="grid grid-cols-4 gap-12">
        <Disclosure as="div" class="flex flex-col gap-9" {open}>
          <DisclosureButton
            class={{
              base: 'max-w-[fit-content] px-6 py-2 | font-medium rounded-md ring-2',
              open: { on: 'ring-amber-500', off: 'ring-neutral-500' }
            }}
          >
            Toggle
          </DisclosureButton>
          <div class="p-8 rounded-lg shadow-lg" slot="panel" transition:fade let:close>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor facere tenetur soluta!
            </p>
            <button on:click={close}> Close </button>
          </div>
        </Disclosure>
        <Disclosure as="div" class="flex flex-col gap-9" {open}>
          <DisclosureButton
            class={{
              base: 'max-w-[fit-content] px-6 py-2 | font-medium rounded-md ring-2',
              open: { on: 'ring-amber-500', off: 'ring-neutral-500' }
            }}
          >
            Toggle
          </DisclosureButton>
          <div class="p-8 rounded-lg shadow-lg" slot="panel" transition:fly={{ y: 50 }} let:close>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor facere tenetur soluta!
            </p>
            <button on:click={close}> Close </button>
          </div>
        </Disclosure>
        <Disclosure as="div" class="flex flex-col gap-9" {open}>
          <DisclosureButton
            class={{
              base: 'max-w-[fit-content] px-6 py-2 | font-medium rounded-md ring-2',
              open: { on: 'ring-amber-500', off: 'ring-neutral-500' }
            }}
          >
            Toggle
          </DisclosureButton>
          <div class="p-8 rounded-lg shadow-lg" slot="panel" transition:slide let:close>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor facere tenetur soluta!
            </p>
            <button on:click={close}> Close </button>
          </div>
        </Disclosure>
        <Disclosure as="div" class="flex flex-col gap-9" {open}>
          <DisclosureButton
            class={{
              base: 'max-w-[fit-content] px-6 py-2 | font-medium rounded-md ring-2',
              open: { on: 'ring-amber-500', off: 'ring-neutral-500' }
            }}
          >
            Toggle
          </DisclosureButton>
          <div
            class="p-8 rounded-lg shadow-lg"
            slot="panel"
            transition:scale={{ start: 0.25 }}
            let:close
          >
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor facere tenetur soluta!
            </p>
            <button on:click={close}> Close </button>
          </div>
        </Disclosure>
      </div>
    </section>
    <section class="grid gap-10">
      <header class="flex items-center gap-8">
        <button
          class="px-6 py-2 | rounded-md ring-2 {isOpen
            ? 'ring-green-400'
            : 'ring-neutral-400'} font-medium"
          on:click={togglePrimitive}
          aria-label="Toggle Vertical Navigation"
        >
          Toggle
        </button>
        <h2 class="text-3xl font-bold">Primitive Open Binding</h2>
      </header>
      <div class="grid grid-cols-4 gap-12">
        <Disclosure as="div" class="flex flex-col gap-9" bind:open={isOpen}>
          <DisclosureButton
            class={{
              base: 'max-w-[fit-content] px-6 py-2 | font-medium rounded-md ring-2',
              open: { on: 'ring-amber-500', off: 'ring-neutral-500' }
            }}
          >
            Toggle
          </DisclosureButton>
          <div class="p-8 rounded-lg shadow-lg" slot="panel" transition:fade let:close>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor facere tenetur soluta!
            </p>
            <button on:click={close}> Close </button>
          </div>
        </Disclosure>
        <Disclosure as="div" class="flex flex-col gap-9" bind:open={isOpen}>
          <DisclosureButton
            class={{
              base: 'max-w-[fit-content] px-6 py-2 | font-medium rounded-md ring-2',
              open: { on: 'ring-amber-500', off: 'ring-neutral-500' }
            }}
          >
            Toggle
          </DisclosureButton>
          <div class="p-8 rounded-lg shadow-lg" slot="panel" transition:fly={{ y: 50 }} let:close>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor facere tenetur soluta!
            </p>
            <button on:click={close}> Close </button>
          </div>
        </Disclosure>
        <Disclosure as="div" class="flex flex-col gap-9" bind:open={isOpen}>
          <DisclosureButton
            class={{
              base: 'max-w-[fit-content] px-6 py-2 | font-medium rounded-md ring-2',
              open: { on: 'ring-amber-500', off: 'ring-neutral-500' }
            }}
          >
            Toggle
          </DisclosureButton>
          <div class="p-8 rounded-lg shadow-lg" slot="panel" transition:slide let:close>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor facere tenetur soluta!
            </p>
            <button on:click={close}> Close </button>
          </div>
        </Disclosure>
        <Disclosure as="div" class="flex flex-col gap-9" bind:open={isOpen}>
          <DisclosureButton
            class={{
              base: 'max-w-[fit-content] px-6 py-2 | font-medium rounded-md ring-2',
              open: { on: 'ring-amber-500', off: 'ring-neutral-500' }
            }}
          >
            Toggle
          </DisclosureButton>
          <div
            class="p-8 rounded-lg shadow-lg"
            slot="panel"
            transition:scale={{ start: 0.25 }}
            let:close
          >
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor facere tenetur soluta!
            </p>
            <button on:click={close}> Close </button>
          </div>
        </Disclosure>
      </div>
    </section>
    <section class="grid gap-10">
      <header class="flex items-center gap-8">
        <div>
          <h2 class="text-3xl font-bold">Uncontrolled</h2>
          <p class="text-sm font-medium opacity-50">
            Should be able to handle open state on its own
          </p>
        </div>
      </header>
      <div class="grid grid-cols-4 gap-12">
        <Disclosure as="div" class="flex flex-col gap-9">
          <DisclosureButton
            class={{
              base: 'max-w-[fit-content] px-6 py-2 | font-medium rounded-md ring-2',
              open: { on: 'ring-amber-500', off: 'ring-neutral-500' }
            }}
          >
            Toggle
          </DisclosureButton>
          <!-- WE CANNOT USE TRANSITIONS HERE BECAUSE SVELTE:ELEMENT DOES NOT SUPPORT TRANSITION|LOCAL -->
          <DisclosurePanel class="p-8 rounded-lg shadow-lg" let:close>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor facere tenetur soluta!
            </p>
            <button on:click={close}> Close </button>
          </DisclosurePanel>
        </Disclosure>
        <Disclosure as="div" class="flex flex-col gap-9">
          <DisclosureButton
            class={{
              base: 'max-w-[fit-content] px-6 py-2 | font-medium rounded-md ring-2',
              open: { on: 'ring-amber-500', off: 'ring-neutral-500' }
            }}
          >
            Toggle
          </DisclosureButton>
          <div
            class="p-8 rounded-lg shadow-lg"
            slot="panel"
            transition:fly|local={{ y: 50 }}
            let:close
          >
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor facere tenetur soluta!
            </p>
            <div class="grid gap-6">
              <!-- WE HAVE TO USE TRANSITION:LOCAL SO THAT THE TRANSITION OUT DOES NOT PLAY WHEN LEAVING THE PAGE -->
              <a class="block text-center" href="/">Home</a>
              <button on:click={close}> Close </button>
            </div>
          </div>
        </Disclosure>
        <Disclosure as="div" class="flex flex-col gap-9">
          <DisclosureButton
            class={{
              base: 'max-w-[fit-content] px-6 py-2 | font-medium rounded-md ring-2',
              open: { on: 'ring-amber-500', off: 'ring-neutral-500' }
            }}
          >
            Toggle
          </DisclosureButton>
          <div class="p-8 rounded-lg shadow-lg" slot="panel" transition:slide let:close>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor facere tenetur soluta!
            </p>
            <button on:click={close}> Close </button>
          </div>
        </Disclosure>
        <Disclosure as="div" class="flex flex-col gap-9">
          <DisclosureButton
            class={{
              base: 'max-w-[fit-content] px-6 py-2 | font-medium rounded-md ring-2',
              open: { on: 'ring-amber-500', off: 'ring-neutral-500' }
            }}
          >
            Toggle
          </DisclosureButton>
          <div
            class="p-8 rounded-lg shadow-lg"
            slot="panel"
            transition:scale={{ start: 0.25 }}
            let:close
          >
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor facere tenetur soluta!
            </p>
            <button on:click={close}> Close </button>
          </div>
        </Disclosure>
      </div>
    </section>
  </div>
</main>
