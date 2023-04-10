<script lang="ts">
  import type { Maybe } from '$lib/types';
  import { Switch } from '$lib';

  export let checked: Maybe<boolean> = undefined;
  export let disabled: Maybe<boolean> = undefined;
</script>

<span data-testid="binding-checked-global">{checked}</span>
<Switch as="fragment" bind:checked let:isChecked let:switcher>
  <button data-testid="switch" {disabled} use:switcher>
    <span data-testid="binding-checked">{isChecked}</span>
  </button>
</Switch>
