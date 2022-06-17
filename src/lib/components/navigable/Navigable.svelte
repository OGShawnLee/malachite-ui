<script lang="ts">
  import { createNavigable } from './state';
  import type { ClassName, Expand, Forwarder, Nullable, RenderElementTagName } from '$lib/types';
  import type { Readable } from 'svelte/store';
  import { Render } from '$lib/components';
  import { useClassNameResolver } from '$lib/hooks';
  import { createStoreWrapper } from '$lib/utils';

  export let vertical: Readable<boolean> | boolean = false;
  export let global: Readable<boolean> | boolean = false;

  const { Global, Vertical, self } = createNavigable({
    Global: createStoreWrapper({ Store: global, initialValue: false }),
    Vertical: createStoreWrapper({ Store: vertical, initialValue: false })
  });

  $: Vertical.sync({ previous: $Vertical, current: vertical });
  $: Global.sync({ previous: $Global, current: global });

  const { Proxy, action } = self;

  let className: ClassName<'isDisabled'> = undefined;

  export { className as class };
  export let as: RenderElementTagName = 'div';
  export let disabled: Nullable<boolean> = undefined;
  export let element: HTMLElement | null = null;
  export let use: Expand<Forwarder.Actions> = [];

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
