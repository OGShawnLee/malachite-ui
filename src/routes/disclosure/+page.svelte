<script>
  import { Disclosure, DisclosureButton, DisclosurePanel } from '$lib';
</script>

<main>
  <Disclosure class="grid gap-3">
    <DisclosureButton class="px-6 py-2 | bg-neutral-800 uppercase font-medium">Toggle</DisclosureButton>
    <DisclosurePanel class="bg-neutral-800" let:close>
      <p class="leading-relaxed">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cumque, dolore impedit quaerat
        dolor esse error mollitia ullam non minus atque.
      </p>
      <button class="border-2 border-neutral-700 text-sm" on:click={close}> Close </button>
    </DisclosurePanel>
  </Disclosure>
</main>
