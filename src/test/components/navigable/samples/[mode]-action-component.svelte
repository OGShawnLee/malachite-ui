<script lang="ts">
  import { Navigable, NavigableItem } from '$lib/components';
  import type { Readable } from 'svelte/store';

  export let vertical: boolean | Readable<boolean> | undefined = undefined;
  export let global: boolean | Readable<boolean> | undefined = undefined;
</script>

<div>External Container</div>

<button> External Button </button>

<Navigable {global} {vertical} as="slot" let:navigable>
  <div data-testid="root" use:navigable>
    <NavigableItem as="slot" let:item>
      <div use:item>Item 1</div>
    </NavigableItem>
    <NavigableItem as="slot" let:item>
      <div use:item>Item 2</div>
    </NavigableItem>
    <NavigableItem as="slot" let:item>
      <div use:item>Item 3</div>
    </NavigableItem>
    <NavigableItem as="slot" let:item>
      <div use:item>Item 4</div>
    </NavigableItem>
  </div>
</Navigable>
