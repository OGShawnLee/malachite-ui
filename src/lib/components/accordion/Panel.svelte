<script lang="ts">
  import { ItemContext } from './state';
  import { Render } from '$lib/components';
  import type { ClassName, Expand, Forwarder, Nullable, RenderElementTagName } from '$lib/types';
  import { useClassNameResolver } from '$lib/hooks';

  const { Open, panel, close } = ItemContext.getContext();
  const { Proxy, action } = panel;

  let className: ClassName<'isDisabled'> = undefined;

  export { className as class };
  export let as: RenderElementTagName = 'div';
  export let disabled: Nullable<boolean> = undefined;
  export let element: HTMLElement | undefined = undefined;
  export let use: Expand<Forwarder.Actions> = [];

  let finalUse: Forwarder.Actions;
  $: finalUse = [...use, [action]];

  $: isDisabled = disabled ?? false;
  $: resolve = useClassNameResolver(className);
  $: finalClassName = resolve({ isDisabled });
</script>

{#if $Open}
  <Render
    {as}
    {Proxy}
    class={finalClassName}
    bind:disabled
    bind:element
    use={finalUse}
    {...$$restProps}
  >
    <slot {isDisabled} panel={action} {close} />
  </Render>
{/if}
