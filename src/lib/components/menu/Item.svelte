<script lang="ts">
  import { getContext } from './state';
  import { Render } from '$lib/components';
  import type { ClassName, Expand, Forwarder, Nullable, RenderElementTagName } from '$lib/types';
  import { Bridge } from '$lib/stores';
  import { useClassNameResolver } from '$lib/hooks';

  const { initItem } = getContext();
  const { Proxy, action } = initItem(new Bridge());
  const { Selected } = Proxy;

  let className: ClassName<'isDisabled' | 'isSelected'> = undefined;

  export { className as class };
  export let as: RenderElementTagName = 'li';
  export let disabled: Nullable<boolean> = undefined;
  export let element: HTMLElement | undefined = undefined;
  export let use: Expand<Forwarder.Actions> = [];

  let finalUse: Forwarder.Actions;
  $: finalUse = [...use, [action]];

  $: isDisabled = disabled ?? false;
  $: finalClassName = useClassNameResolver(className)({ isDisabled, isSelected: $Selected });
</script>

<Render
  {as}
  {Proxy}
  bind:element
  {disabled}
  class={finalClassName}
  use={finalUse}
  {...$$restProps}
  on:click
>
  <slot {isDisabled} isSelected={$Selected} item={action} />
</Render>
