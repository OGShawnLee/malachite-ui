<script>
  import { Navigable, NavigableItem } from '$lib/components';

  let global = false;
  let disabled = true;
  let tabIndex = 0;
</script>

<button> Previous </button>
<button on:click={() => (global = !global)}> Toggle Global Navigation {global} </button>

<section class="p-8">
  <h2>Disabled - TabIndex</h2>

  <button on:click={() => (disabled = !disabled)}> Toggle Disabled </button>

  <input type="number" bind:value={tabIndex} />

  <Navigable>
    <NavigableItem class="focus:font-bold">Item 1</NavigableItem>
    <NavigableItem class="focus:font-bold" as="slot" {disabled} let:item>
      <div
        class={disabled ? 'focus:font-bold text-red-400' : 'focus:font-bold text-green-400'}
        use:item
      >
        Item 2 - {disabled}
      </div>
    </NavigableItem>
    <NavigableItem class="focus:font-bold">Item 3</NavigableItem>
  </Navigable>
</section>

<Navigable class="p-8 bg-cyan-100" vertical {global}>
  <p>Container</p>

  <NavigableItem class={{ base: 'font-bold focus:text-sky-800' }}>First Item</NavigableItem>
  <NavigableItem class={{ base: 'font-bold focus:text-sky-800' }}>Second Item</NavigableItem>
  <NavigableItem
    as="button"
    class={{ base: 'font-bold focus:text-sky-800', disabled: 'opacity-50' }}
    disabled
  >
    Third Item
  </NavigableItem>
  <NavigableItem class={{ base: 'font-bold focus:text-sky-800', disabled: 'opacity-50' }} disabled>
    Fourth Item
  </NavigableItem>
  <NavigableItem as="slot" let:item>
    <div class="font-bold focus:text-sky-800 opacity-50" disabled use:item>Action Item</div>
  </NavigableItem>
  <NavigableItem as="slot" let:item>
    <div class="font-bold focus:text-sky-800 opacity-50" disabled={true} use:item>Action Item</div>
  </NavigableItem>
  <NavigableItem class={{ base: 'font-bold focus:text-sky-800' }}>Forth Item</NavigableItem>
</Navigable>

<button> External </button>

<div class="h-180">
  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Perspiciatis autem quasi repellat amet
  quo voluptates voluptas! Ducimus dolore ad repellendus.
</div>
