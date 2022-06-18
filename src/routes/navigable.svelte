<script>
  import { Navigable, NavigableItem } from '$lib/components';
  import { useToggle } from '@test-utils';

  const [finite, toggleFinite] = useToggle();
  const [global, toggleGlobal] = useToggle();
  const [vertical, toggleVertical] = useToggle();
  const [disabled, toggleDisabled] = useToggle(true);
</script>

<main class="md:max-w-4xl xl:max-w-6xl mx-auto py-12 | grid gap-12">
  <h1 class="text-6xl font-bold">Navigable</h1>

  <div class="grid gap-24">
    <Navigable class="grid gap-10" as="section" {finite}>
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
      <div class="flex gap-3">
        <NavigableItem
          class="px-6 py-2 | rounded-md ring-2 ring-neutral-200 font-medium focus:ring-rose-600"
        >
          First Item
        </NavigableItem>
        <NavigableItem
          class="px-6 py-2 | rounded-md ring-2 ring-neutral-200 font-medium focus:ring-rose-600"
        >
          Second Item
        </NavigableItem>
        <NavigableItem
          class="px-6 py-2 | rounded-md ring-2 ring-neutral-200 font-medium focus:ring-rose-600"
        >
          Third Item
        </NavigableItem>
      </div>
    </Navigable>
    <Navigable class="grid gap-10" as="section" {global}>
      <header class="flex items-center gap-8">
        <button
          class="px-6 py-2 | rounded-md ring-2 {$global
            ? 'ring-green-400'
            : 'ring-neutral-400'} font-medium"
          on:click={toggleGlobal}
          aria-label="Toggle Vertical Navigation"
        >
          Toggle
        </button>
        <div>
          <h2 class="text-3xl font-bold">Global Navigation</h2>
          <p class="text-sm font-medium opacity-50">
            Only one global navigation should be active at once
          </p>
        </div>
      </header>
      <div class="flex gap-3">
        <NavigableItem
          class="px-6 py-2 | rounded-md ring-2 ring-neutral-200 font-medium focus:ring-rose-600"
        >
          First Item
        </NavigableItem>
        <NavigableItem
          class="px-6 py-2 | rounded-md ring-2 ring-neutral-200 font-medium focus:ring-rose-600"
        >
          Second Item
        </NavigableItem>
        <NavigableItem
          class="px-6 py-2 | rounded-md ring-2 ring-neutral-200 font-medium focus:ring-rose-600"
        >
          Third Item
        </NavigableItem>
      </div>
    </Navigable>
    <Navigable class="grid gap-10" as="section" {vertical}>
      <header class="flex items-center gap-8">
        <button
          class="px-6 py-2 | rounded-md ring-2 {$vertical
            ? 'ring-green-400'
            : 'ring-neutral-400'} font-medium"
          on:click={toggleVertical}
          aria-label="Toggle Vertical Navigation"
        >
          Toggle
        </button>
        <h2 class="text-3xl font-bold">Vertical Navigation</h2>
      </header>
      <div class="flex gap-3">
        <NavigableItem
          class="px-6 py-2 | rounded-md ring-2 ring-neutral-200 font-medium focus:ring-rose-600"
        >
          First Item
        </NavigableItem>
        <NavigableItem
          class="px-6 py-2 | rounded-md ring-2 ring-neutral-200 font-medium focus:ring-rose-600"
        >
          Second Item
        </NavigableItem>
        <NavigableItem
          class="px-6 py-2 | rounded-md ring-2 ring-neutral-200 font-medium focus:ring-rose-600"
        >
          Third Item
        </NavigableItem>
      </div>
    </Navigable>
    <Navigable class="grid gap-10" as="section">
      <header class="flex items-center gap-8">
        <button
          class="px-6 py-2 | rounded-md ring-2 {$disabled
            ? 'ring-green-400'
            : 'ring-neutral-400'} font-medium"
          on:click={toggleDisabled}
          aria-label="Toggle Vertical Navigation"
        >
          Toggle
        </button>
        <div>
          <h2 class="text-3xl font-bold">Navigation with Disabled Items</h2>
          <p class="text-sm font-medium opacity-50">
            Disabled Items should lose their focusable state
          </p>
        </div>
      </header>
      <div class="flex gap-3">
        <NavigableItem
          class={{
            base: 'px-6 py-2 rounded-md ring-2 font-medium focus:ring-rose-600',
            disabled: { on: 'opacity-50', off: 'ring-neutral-200' }
          }}
          disabled={$disabled}
        >
          First Item
        </NavigableItem>
        <NavigableItem
          class="px-6 py-2 | rounded-md ring-2 ring-neutral-200 font-medium focus:ring-rose-600"
        >
          Second Item
        </NavigableItem>
        <NavigableItem
          class="px-6 py-2 | rounded-md ring-2 ring-neutral-200 font-medium focus:ring-rose-600"
        >
          Third Item
        </NavigableItem>
        <NavigableItem
          class="px-6 py-2 | rounded-md ring-2 ring-neutral-200 font-medium focus:ring-rose-600"
        >
          Fourth Item
        </NavigableItem>
        <NavigableItem
          class={{
            base: 'px-6 py-2 | rounded-md ring-2 font-medium focus:ring-rose-600',
            disabled: { on: 'opacity-50', off: 'ring-neutral-200' }
          }}
          disabled={$disabled}
        >
          Fifth Item
        </NavigableItem>
      </div>
    </Navigable>
  </div>
</main>
