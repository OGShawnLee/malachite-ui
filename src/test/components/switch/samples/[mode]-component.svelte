<script lang="ts">
  import type { Maybe } from '$lib/types';
  import { Switch } from '$lib';

  export let checked: Maybe<boolean> = undefined;
  export let disabled: Maybe<boolean> = undefined;
</script>

<span data-testid="binding-checked-global">{checked}</span>
<Switch data-testid="switch" bind:checked {disabled} let:isChecked let:isDisabled>
  <span data-testid="binding-checked">{isChecked}</span>
  <span data-testid="binding-disabled">{isDisabled}</span>
</Switch>
