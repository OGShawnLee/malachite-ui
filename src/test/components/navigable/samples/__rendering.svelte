<script lang="ts">
  import { Navigable, NavigableItem } from '$lib';
  import type { Forwarder, RenderElementTagName } from '$lib/types';

  interface ComponentConfig {
    as?: RenderElementTagName;
    use?: Forwarder.Actions;
    rest?: {};
  }

  export let navigable: ComponentConfig = {};
  export let item: ComponentConfig = {};
</script>

<Navigable
  data-testid="navigable-navigable"
  as={navigable.as}
  use={navigable.use}
  {...navigable.rest}
>
  <NavigableItem data-testid="navigable-item" as={item.as} use={item.use} {...item.rest}>
    Item 1
  </NavigableItem>
</Navigable>
