<script lang="ts">
  import type { Action } from '$lib/types';
  import { forward } from '$lib/core';

  export let actions: Action[];
  export let isShowing = true;
</script>

{#if isShowing}
  <div data-testid="element" use:forward={actions} />
{/if}
