<script lang="ts">
  import type { Action } from 'svelte/action';
  import type { Forwarder } from '$lib/types';
  import { forwardActions } from '$lib/core';

  export let use: Expand<Forwarder.Actions> = [];

  export let first: Action = () => {};
  export let firstParam: string = 'James';

  export let second: Action = () => {};
  export let secondParam: number = 25;

  export let showing = true;
</script>

{#if showing}
  <div
    use:forwardActions={use}
    use:forwardActions={[
      [first, firstParam],
      [second, secondParam]
    ]}
  >
    Container
  </div>
{/if}
