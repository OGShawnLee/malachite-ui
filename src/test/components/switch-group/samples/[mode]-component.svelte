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
    <SwitchLabel data-testid="switch-label" {passive} let:isChecked>
      <span data-testid="binding-checked-label">{isChecked}</span>
    </SwitchLabel>
    <SwitchDescription data-testid="switch-description" let:isChecked>
      <span data-testid="binding-checked-description">{isChecked}</span>
    </SwitchDescription>
  {/each}
  <Switch data-testid="switch" {disabled} let:isChecked>
    <span data-testid="binding-checked-switch">{isChecked}</span>
  </Switch>
</SwitchGroup>
