<script lang="ts">
  import Popover from './state';
  import { GroupContext } from './Group.state';
  import { Render } from '$lib/components';
  import type { ClassName, Forwarder, Nullable, RenderElementTagName } from '$lib/types';
  import { storable } from '$lib/stores';
  import { useClassNameResolver } from '$lib/hooks';

  const PopoverContext = Popover.getContext(false);
  const {
    Open,
    overlay: { Proxy, action }
  } = PopoverContext ? PopoverContext : GroupContext.getContext();

  const ShowOverlay = storable({
    Store: Popover.getContext(false)?.ShowOverlay,
    initialValue: true
  });

  let className: ClassName<'isDisabled' | 'isOpen'> = undefined;

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

{#if $Open && $ShowOverlay}
  <Render
    {as}
    {Proxy}
    class={finalClassName}
    bind:disabled
    bind:element
    {...$$restProps}
    use={finalUse}
  >
    <slot isOpen={$Open} isDisabled={disabled} overlay={action} />
  </Render>
{/if}
