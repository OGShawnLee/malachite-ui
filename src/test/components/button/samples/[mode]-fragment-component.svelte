<script lang="ts">
  import type { Maybe } from '$lib/types';
  import { Button } from '$lib';

  export let pressed: Maybe<boolean> = undefined;
  export let disabled: Maybe<boolean> = undefined;
</script>

<Button as="fragment" bind:pressed let:isPressed let:button>
  <button use:button {disabled} data-testid="button">
    Toggle
    <span data-testid="binding-pressed">{isPressed}</span>
  </button>
</Button>
