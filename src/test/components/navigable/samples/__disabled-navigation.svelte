<script lang="ts">
  import { Navigable, NavigableItem } from '$lib/components';

  export let vertical: boolean | undefined = undefined;
  export let global: boolean | undefined = undefined;
</script>

<div>External Container</div>

<button> External Button </button>

<Navigable {global} {vertical} data-testid="root">
  <NavigableItem disabled>Item 1</NavigableItem>
  <NavigableItem>Item 2</NavigableItem>
  <NavigableItem disabled>Item 3</NavigableItem>
  <NavigableItem>Item 4</NavigableItem>
  <NavigableItem disabled>Item 5</NavigableItem>
  <NavigableItem>Item 6</NavigableItem>
  <NavigableItem disabled>Item 7</NavigableItem>
</Navigable>
