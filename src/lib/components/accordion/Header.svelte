<script lang="ts">
  import { ItemContext } from './state';
  import { Render } from '$lib/components';
  import type { ClassName, Expand, Forwarder, Nullable, RenderElementTagName } from '$lib/types';
  import { useClassNameResolver } from '$lib/hooks';

  const { Open, header } = ItemContext.getContext();
  const { Proxy, action } = header;

  let className: ClassName<'isDisabled' | 'isOpen'> = undefined;

  export { className as class };
  export let as: RenderElementTagName = 'h2';
  export let element: HTMLElement | undefined = undefined;
  export let level: number | string | undefined = undefined;
  export let disabled: Nullable<boolean> = undefined;
  export let use: Expand<Forwarder.Actions> = [];

  let finalUse: Forwarder.Actions;
  $: finalUse = [...use, [action, level]];

  $: isDisabled = disabled ?? false;
  $: resolve = useClassNameResolver(className);
  $: finalClassName = resolve({ isDisabled, isOpen: $Open });
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
  <slot {isDisabled} isOpen={$Open} header={action} />
</Render>
