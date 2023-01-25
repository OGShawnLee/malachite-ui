<script lang="ts">
  import { Disclosure } from '$lib/components';

  export let open: boolean | undefined = undefined;
</script>

<Disclosure {open} data-testid="disclosure-root" let:button let:panel let:close>
  <button use:button>Toggle</button>
  <div slot="panel" data-testid="disclosure-panel" use:panel let:close>
    <button on:click={close}> Close Panel </button>
  </div>
</Disclosure>
