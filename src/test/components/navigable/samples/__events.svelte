<script>
  import { Navigable, NavigableItem } from '$lib/components';

  export let handleBlur = () => {};
  export let handleClick = () => {};
  export let handleFocus = () => {};
</script>

<Navigable>
  <NavigableItem on:blur={handleBlur} on:click={handleClick} on:focus={handleFocus}>
    Item
  </NavigableItem>
</Navigable>
