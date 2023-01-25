<script lang="ts">
  import { Navigable, NavigableItem } from '$lib/components';

  export let vertical: boolean | undefined = undefined;
  export let global: boolean | undefined = undefined;
  export let finite: boolean | undefined = undefined;
</script>

<div>External Container</div>

<button> External Button </button>

<Navigable {finite} {global} {vertical} data-testid="root">
  <NavigableItem>Item 1</NavigableItem>
  <NavigableItem>Item 2</NavigableItem>
  <NavigableItem>Item 3</NavigableItem>
  <NavigableItem>Item 4</NavigableItem>
</Navigable>
