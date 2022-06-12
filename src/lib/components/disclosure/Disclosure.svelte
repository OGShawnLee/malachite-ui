<script lang="ts">
  import { createDisclosure } from './state';
  import { Render } from '$lib/components';
  import type { ClassName, Expand, Forwarder, Nullable, RenderElementTagName } from '$lib/types';
  import type { Writable } from 'svelte/store';
  import { isNotStore } from '$lib/predicate';
  import { useClassNameResolver } from '$lib/hooks';
  import { storable } from '$lib/stores';

  export let open: Writable<boolean> | boolean = false;

  const { Open, button, panel, close, sync } = createDisclosure({
    Open: storable({
      Store: open,
      initialValue: false,
      notifier: (isOpen) => isNotStore(open) && (open = isOpen)
    })
  });

  $: sync({ previous: $Open, value: open });

  let className: ClassName<'isDisabled' | 'isOpen'> = undefined;

  export { className as class };
  export let as: RenderElementTagName = 'slot';
  export let disabled: Nullable<boolean> = undefined;
  export let element: HTMLElement | undefined = undefined;
  export let use: Expand<Forwarder.Actions> = [];

  $: isDisabled = disabled ?? false;

  $: resolve = useClassNameResolver(className);
  $: finalClassName = resolve({ isOpen: $Open, isDisabled });
</script>

<Render {as} class={finalClassName} {disabled} bind:element {...$$restProps} {use}>
  {#if $Open}
    <slot name="up-panel" {isDisabled} panel={panel.action} {close} />
  {/if}
  <!-- we render the panel above the button -->
  <slot isOpen={$Open} button={button.action} {isDisabled} panel={panel.action} {close} />
  <!-- we render the panel below the button -->
  {#if $Open}
    <slot name="panel" {isDisabled} panel={panel.action} {close} />
  {/if}
</Render>
