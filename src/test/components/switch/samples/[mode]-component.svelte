<script lang="ts">
  import { Switch } from '$lib/components';
  import type { Writable } from 'svelte/store';

  export let checked: Writable<boolean> | boolean | undefined = undefined;
  export let click: (event: MouseEvent) => void = () => {};
</script>

<Switch {checked} let:isChecked data-testid="switch-root" on:click={click}>
  <span> Toggle Color Mode </span>
  <span aria-hidden="true" data-testid="switch-isChecked-holder">
    {isChecked}
  </span>
</Switch>
