<script lang="ts">
  import { createPopover } from './state';
  import { Render } from '$lib/components';
  import type { ClassName, Expand, Forwarder, Nullable, RenderElementTagName } from '$lib/types';
  import type { Readable } from 'svelte/store';
  import { useClassNameResolver } from '$lib/hooks';

  export let forceFocus: Readable<boolean> | boolean = false;

  const { Open, ForceFocus, ShowOverlay, close, button, overlay, panel } = createPopover({
    ForceFocus: forceFocus
  });

  $: ForceFocus.sync({ previous: $ForceFocus, current: forceFocus });

  let className: ClassName<'isDisabled' | 'isOpen'> = undefined;

  export { className as class };
  export let as: RenderElementTagName = 'div';
  export let disabled: Nullable<boolean> = undefined;
  export let element: HTMLElement | undefined = undefined;
  export let use: Expand<Forwarder.Actions> = [];

  $: isDisabled = disabled ?? false;
  $: finalClassName = useClassNameResolver(className)({ isDisabled, isOpen: $Open });
</script>

<Render {as} bind:element class={finalClassName} {...$$restProps} {use}>
  {#if $Open && $ShowOverlay}
    <slot name="overlay" overlay={overlay.action} />
  {/if}
  {#if $Open}
    <slot name="up-panel" panel={panel.action} {close} />
  {/if}
  <slot
    isOpen={$Open}
    {isDisabled}
    overlay={overlay.action}
    button={button.action}
    panel={panel.action}
    {close}
  />
  {#if $Open}
    <slot name="panel" panel={panel.action} {close} />
  {/if}
</Render>
