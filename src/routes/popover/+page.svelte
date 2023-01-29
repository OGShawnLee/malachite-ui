<script>
  import { Popover, PopoverButton, PopoverPanel } from '$lib';
</script>

<main>
  <Popover class="grid gap-3">
    <PopoverButton class="px-6 py-2 | bg-neutral-800 uppercase font-medium">Toggle</PopoverButton>
    <PopoverPanel class="px-6 bg-neutral-800" let:close>
      <p class="leading-relaxed">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cumque, dolore impedit quaerat
        dolor esse error mollitia ullam non minus atque.
      </p>
      <button class="border-2 border-neutral-700 text-sm" on:click={close}> Close </button>
    </PopoverPanel>
  </Popover>
</main>
