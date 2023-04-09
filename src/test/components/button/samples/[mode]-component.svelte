<script lang="ts">
  import type { Maybe } from '$lib/types';
  import { Button } from '$lib';

  export let pressed: Maybe<boolean> = undefined;
  export let disabled: Maybe<boolean> = undefined;
</script>

<Button bind:pressed {disabled} data-testid="button" let:isDisabled let:isPressed>
  <span data-testid="binding-pressed">{isPressed}</span>
  <span data-testid="binding-disabled">{isDisabled}</span>
</Button>
