<script lang="ts">
  import type { Readable } from 'svelte/store';
  import { Navigable, NavigableItem } from '$lib/components';

  export let vertical: boolean | Readable<boolean> | undefined = undefined;
  export let global: boolean | Readable<boolean> | undefined = undefined;
</script>

<div>External Container</div>

<button> External Button </button>

<Navigable {global} {vertical} data-testid="root">
  <NavigableItem>Item 1</NavigableItem>
  <NavigableItem>Item 2</NavigableItem>
  <NavigableItem>Item 3</NavigableItem>
  <NavigableItem>Item 4</NavigableItem>
</Navigable>
