<script lang="ts">
  import type { Action, RenderElementTagName } from '$lib/types';
  import { Navigable, NavigableItem } from '$lib';

  interface ComponentConfig {
    as?: RenderElementTagName;
    use?: Action[];
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
