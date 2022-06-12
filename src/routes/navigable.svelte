<script>
  import { Navigable, NavigableItem } from '$lib/components';
</script>

<button> Previous </button>

<Navigable vertical>
  <NavigableItem class={{ base: 'focus:text-sky-400' }}>First Item</NavigableItem>
  <NavigableItem class={{ base: 'focus:text-sky-400' }}>Second Item</NavigableItem>
  <NavigableItem class={{ base: 'focus:text-sky-400' }}>Third Item</NavigableItem>
</Navigable>

<button> External </button>
