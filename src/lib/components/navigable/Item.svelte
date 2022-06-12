<script lang="ts">
  import { getContext } from './state';
  import type { ClassName, Forwarder, Nullable, RenderElementTagName } from '$lib/types';
  import { Bridge } from '$lib/stores';
  import { Render } from '$lib/components';
  import { useClassNameResolver } from '$lib/hooks';

  const { initItem } = getContext();
  const { Proxy, action } = initItem(new Bridge());

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
  on:click
>
  <slot {isDisabled} item={action} />
</Render>
