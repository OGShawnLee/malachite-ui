<script lang="ts">
  import { getContext } from './state';
  import { Render } from '$lib/components';
  import type { ClassName, Expand, Forwarder, Nullable, RenderElementTagName } from '$lib/types';
  import { Bridge } from '$lib/stores';
  import { useClassNameResolver } from '$lib/hooks';

  const { Proxy, action } = getContext().initItem(new Bridge());

  let className: ClassName<'isDisabled'> = undefined;

  export { className as class };
  export let as: RenderElementTagName = 'div';
  export let disabled: Nullable<boolean> = undefined;
  export let element: HTMLElement | null = null;
  export let tabIndex: number | undefined = 0;
  export let use: Expand<Forwarder.Actions> = [];

  $: finalTabIndex = disabled ? undefined : tabIndex;

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
  tabIndex={finalTabIndex}
  {...$$restProps}
  on:click
>
  <slot {isDisabled} item={action} />
</Render>
