<script lang="ts">
  import type { Maybe } from '$lib/types';
  import { Navigable, NavigableItem } from '$lib/components';

  export let disabled: Maybe<boolean> = undefined;
  export let finite: Maybe<boolean> = undefined;
  export let global: Maybe<boolean> = undefined;
  export let vertical: Maybe<boolean> = undefined;
</script>

<div>External Container</div>

<button> External Button </button>

<Navigable {finite} {global} {vertical} data-testid="navigable">
  <NavigableItem {disabled}>Item 1</NavigableItem>
  <NavigableItem>Item 2</NavigableItem>
  <NavigableItem {disabled}>Item 3</NavigableItem>
  <NavigableItem>Item 4</NavigableItem>
  <NavigableItem {disabled}>Item 5</NavigableItem>
  <NavigableItem>Item 6</NavigableItem>
</Navigable>
