<script lang="ts">
  import Tabs from './state';
  import { Render } from '$lib/components';
  import type { Readable } from 'svelte/store';
  import type { ClassName, Expand, Forwarder, Nullable, RenderElementTagName } from '$lib/types';
  import { storable } from '$lib/stores';
  import { isNotStore } from '$lib/predicate';
  import { useClassNameResolver } from '$lib/hooks';

  export let index = 0;
  export let manual: Readable<boolean> | boolean = false;
  export let vertical: Readable<boolean> | boolean = false;
  export let order: Readable<boolean> | boolean = false;

  const { Index, Manual, ShouldOrder, Vertical, tabList, tabPanels, sync } = new Tabs({
    Index: storable({
      Store: index,
      initialValue: 0,
      notifier: (value) => isNotStore(index) && (index = value)
    }),
    Manual: storable({ Store: manual, initialValue: false }),
    Vertical: storable({ Store: vertical, initialValue: false }),
    ShouldOrder: storable({ Store: order, initialValue: false })
  });

  $: sync({ previous: $Index, value: index });
  $: Manual.sync({ previous: $Manual, value: manual });
  $: ShouldOrder.sync({ previous: $ShouldOrder, value: order });
  $: Vertical.sync({ previous: $Vertical, value: vertical });

  let className: ClassName<'isDisabled'> = undefined;

  export { className as class };
  export let as: RenderElementTagName = 'div';
  export let disabled: Nullable<boolean> = undefined;
  export let element: HTMLElement | undefined = undefined;
  export let use: Expand<Forwarder.Actions> = [];

  $: isDisabled = disabled ?? false;
  $: resolve = useClassNameResolver(className);
  $: finalClassName = resolve({ isDisabled });
</script>

<Render {as} bind:element {disabled} class={finalClassName} {use} {...$$restProps}>
  <slot {isDisabled} tabList={tabList.action} tabPanels={tabPanels.action} />
</Render>
