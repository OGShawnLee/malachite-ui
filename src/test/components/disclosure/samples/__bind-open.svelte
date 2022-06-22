<script lang="ts">
  import { Disclosure, DisclosureButton, DisclosurePanel } from '$lib/components';

  export let open: boolean | undefined = undefined;
</script>

<span data-testid="open-bind-holder">
  {open}
</span>

<Disclosure bind:open>
  <DisclosureButton>Button</DisclosureButton>
  <DisclosurePanel>Panel</DisclosurePanel>
</Disclosure>
