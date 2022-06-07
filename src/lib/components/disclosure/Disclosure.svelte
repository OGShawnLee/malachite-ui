<script lang="ts">
  import Disclosure from './state';
  import { Render } from '$lib/components';
  import type { ClassName, Expand, Forwarder, Nullable, RenderElementTagName } from '$lib/types';
  import type { Readable, Writable } from 'svelte/store';
  import { storable } from '$lib/stores';
  import { isNotStore } from '$lib/predicate';
  import { useClassNameResolver } from '$lib/hooks';

  export let open: Writable<boolean> | boolean = false;
  export let disabled: Readable<Nullable<boolean>> | Nullable<boolean> = undefined;

  const Disabled = storable({ Store: disabled, initialValue: undefined });
  $: Disabled.sync({ previous: $Disabled, value: disabled });

  const { Open, button, panel, close, sync } = new Disclosure({
    MasterDisabled: Disabled,
    Open: {
      Store: open,
      initialValue: false,
      notifier: (isOpen) => isNotStore(open) && (open = isOpen)
    }
  });

  $: sync({ previous: $Open, value: open });

  let className: ClassName<'isDisabled' | 'isOpen'> = undefined;

  export { className as class };
  export let as: RenderElementTagName = 'slot';
  export let element: HTMLElement | undefined = undefined;
  export let use: Expand<Forwarder.Actions> = [];

  $: resolve = useClassNameResolver(className);
  $: finalClassName = resolve({ isOpen: $Open, isDisabled: $Disabled ?? false });
</script>

<Render {as} class={finalClassName} disabled={$Disabled} bind:element {...$$restProps} {use}>
  {#if $Open}
    <slot name="up-panel" isDisabled={$Disabled} panel={panel.action} {close} />
  {/if}
  <!-- we render the panel above the button -->
  <slot isOpen={$Open} button={button.action} isDisabled={$Disabled} panel={panel.action} {close} />
  <!-- we render the panel below the button -->
  {#if $Open}
    <slot name="panel" isDisabled={$Disabled} panel={panel.action} {close} />
  {/if}
</Render>
