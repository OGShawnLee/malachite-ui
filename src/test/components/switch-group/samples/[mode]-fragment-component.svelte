<script lang="ts">
  import type { Maybe } from '$lib/types';
  import { Switch, SwitchDescription, SwitchGroup, SwitchLabel } from '$lib/components';
  import { useRange } from '@test-utils';

  export let amount = useRange(3);
  export let disabled: Maybe<boolean> = undefined 
  export let passive: Maybe<boolean> = undefined 
</script>

<SwitchGroup data-testid="switch-group" let:isChecked>
  <span data-testid="binding-checked-group">{isChecked}</span>
  {#each $amount as index (index)}
    <SwitchLabel as="fragment" {passive} let:label let:isChecked>
      <label data-testid="switch-label" use:label />
      <span data-testid="binding-checked-label">{isChecked}</span>
    </SwitchLabel>
    <SwitchDescription as="fragment" let:description let:isChecked>
      <span data-testid="switch-description" use:description />
      <span data-testid="binding-checked-description">{isChecked}</span>
    </SwitchDescription>
  {/each}
  <Switch as="fragment" let:isChecked let:switcher>
    <button data-testid="switch" {disabled} use:switcher>
      <span data-testid="binding-checked-switch">{isChecked}</span>
    </button>
  </Switch>
</SwitchGroup>
