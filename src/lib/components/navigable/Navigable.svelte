<script lang="ts">
  import { createNavigable } from './state';
  import type { ClassName, Forwarder, Nullable, RenderElementTagName } from '$lib/types';
  import type { Readable } from 'svelte/store';
  import { storable } from '$lib/stores';
  import { Render } from '$lib/components';
  import { useClassNameResolver } from '$lib/hooks';

  export let vertical: Readable<boolean> | boolean = false;

  const { Vertical, self } = createNavigable({
    Vertical: storable({ Store: vertical, initialValue: false })
  });

  $: Vertical.sync({ previous: $Vertical, value: vertical });

  const { Proxy, action } = self;

  let className: ClassName<'isDisabled'> = undefined;

  export { className as class };
  export let as: RenderElementTagName = 'div';
  export let disabled: Nullable<boolean> = undefined;
  export let element: HTMLElement | null = null;
  export let use: Forwarder.Actions = [];

  let finalUse: Forwarder.Actions;

  $: finalUse = [...use, [action]];
  $: isDisabled = disabled ?? false;
  $: finalClassName = useClassNameResolver(className)({ isDisabled });
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
  <slot {isDisabled} navigable={action} />
</Render>
