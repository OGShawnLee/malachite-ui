<script lang="ts">
  import type { Maybe } from '$lib/types';
  import { Navigable, NavigableItem } from '$lib/components';

  export let finite: Maybe<boolean> = undefined;
  export let disabled: Maybe<boolean> = undefined;
  export let global: Maybe<boolean> = undefined;
  export let vertical: Maybe<boolean> = undefined;
</script>

<div>External Container</div>

<button> External Button </button>

<Navigable {finite} {global} {vertical} as="fragment" let:navigable>
  <div data-testid="navigable" use:navigable>
    <NavigableItem as="fragment" let:item>
      <button {disabled} use:item>Item 1</button>
    </NavigableItem>
    <NavigableItem as="fragment" let:item>
      <button use:item>Item 2</button>
    </NavigableItem>
    <NavigableItem as="fragment" let:item>
      <button {disabled} use:item>Item 3</button>
    </NavigableItem>
    <NavigableItem as="fragment" let:item>
      <button use:item>Item 4</button>
    </NavigableItem>
    <NavigableItem as="fragment" let:item>
      <button {disabled} use:item>Item 5</button>
    </NavigableItem>
    <NavigableItem as="fragment" let:item>
      <button use:item>Item 6</button>
    </NavigableItem>
  </div>
</Navigable>
