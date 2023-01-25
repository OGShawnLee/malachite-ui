<script lang="ts">
  import { createDisclosure } from './state';
  import { Render } from '$lib/components';
  import type { ClassName, Expand, Forwarder, Nullable, RenderElementTagName } from '$lib/types';
  import { isNotStore } from '$lib/predicate';
  import { useClassNameResolver } from '$lib/hooks';
  import { createStoreWrapper } from '$lib/utils';

  export let open = false;

  const { Open, button, panel, close } = createDisclosure({
    Open: createStoreWrapper({
      Store: open,
      initialValue: false,
      notifier: (isOpen) => isNotStore(open) && (open = isOpen)
    })
  });

  $: Open.sync({ previous: $Open, current: open });

  let className: ClassName<'isDisabled' | 'isOpen'> = undefined;

  export { className as class };
  export let as: RenderElementTagName = 'slot';
  export let element: HTMLElement | undefined = undefined;
  export let disabled: Nullable<boolean> = undefined;
  export let use: Expand<Forwarder.Actions> = [];

  $: isDisabled = disabled ?? false;
  $: finalClassName = useClassNameResolver(className)({ isOpen: $Open, isDisabled });
</script>

<Render {as} class={finalClassName} bind:disabled bind:element {...$$restProps} {use}>
  {#if $Open}
    <slot name="up-panel" {isDisabled} panel={panel.action} {close} />
  {/if}
  <!-- we render the panel above the button -->
  <slot isOpen={$Open} {isDisabled} button={button.action} panel={panel.action} {close} />
  <!-- we render the panel below the button -->
  {#if $Open}
    <slot name="panel" {isDisabled} panel={panel.action} {close} />
  {/if}
</Render>
