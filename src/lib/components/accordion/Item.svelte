<script lang="ts">
  import { Context } from './state';
  import { Render } from '$lib/components';
  import type { ClassName, Expand, Forwarder, Nullable, RenderElementTagName } from '$lib/types';
  import type { Readable } from 'svelte/store';
  import { useClassNameResolver } from '$lib/hooks';
  import { storable, Toggleable } from '$lib/stores';

  export let open: Readable<boolean> | boolean = false;

  const InitialOpen = storable({ Store: open, initialValue: false });

  const { Open, button, header, panel, close } = Context.getContext().initItem({
    Toggleable: new Toggleable(),
    initialOpen: $InitialOpen
  });

  let className: ClassName<'isDisabled' | 'isOpen'> = undefined;

  export { className as class };
  export let as: RenderElementTagName = 'div';
  export let element: HTMLElement | undefined = undefined;
  export let disabled: Nullable<boolean> = undefined;
  export let use: Expand<Forwarder.Actions> = [];

  $: isDisabled = disabled ?? false;
  $: resolve = useClassNameResolver(className);
  $: finalClassName = resolve({ isDisabled, isOpen: $Open });
</script>

<Render {as} bind:element bind:disabled class={finalClassName} {use} {...$$restProps}>
  {#if $Open}
    <slot name="up-panel" panel={panel.action} {close} />
  {/if}

  <slot
    isOpen={$Open}
    {isDisabled}
    button={button.action}
    header={header.action}
    panel={panel.action}
    {close}
  />

  {#if $Open}
    <slot name="panel" panel={panel.action} {close} />
  {/if}
</Render>
