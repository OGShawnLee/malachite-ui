<script lang="ts">
  import { Context } from './state';
  import { Render } from '$lib/components';
  import type { ClassName, Expand, Forwarder, Nullable, RenderElementTagName } from '$lib/types';
  import { Bridge } from '$lib/stores';
  import { useClassNameResolver } from '$lib/hooks';

  const Proxy = new Bridge();
  const tab = Context.getContext().initTab(Proxy).action;

  const { Selected } = Proxy;

  let className: ClassName<'isDisabled' | 'isSelected'> = undefined;

  export { className as class };
  export let as: RenderElementTagName = 'button';
  export let element: HTMLElement | undefined = undefined;
  export let disabled: Nullable<boolean> = undefined;
  export let use: Expand<Forwarder.Actions> = [];

  let finalUse: Forwarder.Actions;
  $: finalUse = [...use, [tab]];

  $: isDisabled = disabled ?? false;
  $: finalClassName = useClassNameResolver(className)({ isDisabled, isSelected: $Selected });
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
  <slot {isDisabled} isSelected={$Selected} {tab} />
</Render>
