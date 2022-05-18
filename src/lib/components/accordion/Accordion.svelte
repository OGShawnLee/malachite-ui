<script lang="ts">
  import Accordion from './state';
  import { Render } from '$lib/components';
  import { storable } from '$lib/stores';
  import type { Readable } from 'svelte/store';
  import type { ClassName, Forwarder, Nullable, RenderElementTagName } from '$lib/types';
  import { useClassNameResolver } from '$lib/hooks';

  export let finite: Readable<boolean> | boolean = false;
  export let order: Readable<boolean> | boolean = false;

  const { Open, Finite, ShouldOrder, accordion } = new Accordion({
    Finite: storable({ Store: finite, initialValue: false }),
    ShouldOrder: storable({ Store: order, initialValue: false })
  });

  const { Proxy, action } = accordion;

  $: Finite.sync({ previous: $Finite, value: finite });
  $: ShouldOrder.sync({ previous: $ShouldOrder, value: order });

  let className: ClassName<'isOpen' | 'isDisabled'> = undefined;

  export { className as class };
  export let as: RenderElementTagName = 'div';
  export let disabled: Nullable<boolean> = undefined;
  export let element: HTMLElement | undefined = undefined;
  export let use: Expand<Forwarder.Actions> = [];

  let finalUse: Forwarder.Actions;
  $: finalUse = [...use, [action]];

  $: resolve = useClassNameResolver(className);
  $: finalClassName = resolve({ isDisabled: disabled ?? false, isOpen: $Open });
</script>

<Render
  {as}
  {Proxy}
  bind:element
  bind:disabled
  class={finalClassName}
  use={finalUse}
  {...$$restProps}
>
  <slot isOpen={$Open} isDisabled={disabled ?? false} accordion={action} />
</Render>
