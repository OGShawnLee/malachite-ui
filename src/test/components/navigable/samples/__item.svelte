<script lang="ts">
  import type { Nullable } from '$lib/types';
  import { Navigable, NavigableItem } from '$lib';

  export let disabled: Nullable<boolean> = undefined;
  export let tabIndex: number | undefined = undefined;
  export let handleClick = () => {};
  export let target: 'ACTION' | 'COMPONENT' = 'COMPONENT';
</script>

<Navigable data-testid="root">
  {#if target === 'ACTION'}
  <!-- * Disabled must be set on the component and then forwarded -->
    <NavigableItem as="slot" {disabled} let:item>
      <div {tabIndex} on:click={handleClick} use:item>Item</div>
    </NavigableItem>
  {:else}
    <NavigableItem {disabled} {tabIndex} on:click={handleClick}>Item</NavigableItem>
  {/if}
</Navigable>
