<script lang="ts">
  import Group from './Group.state';
  import { Render } from '$lib/components';
  import type { ClassName, Forwarder, Nullable, RenderElementTagName } from '$lib/types';
  import type { Readable } from 'svelte/store';
  import { storable } from '$lib/stores';
  import { onMount } from 'svelte';
  import { useClassNameResolver } from '$lib/hooks';

  export let expanded: Readable<boolean> | boolean = false;

  const Expanded = storable({ Store: expanded, initialValue: false });
  $: Expanded.sync({ previous: $Expanded, value: expanded });

  const State = new Group({ mode: Group.getMode($Expanded) });
  $: State.mode = Group.getMode($Expanded);

  onMount(State.listen.bind(State));

  const { AllClosed, AllOpen, Open, overlay } = State;

  export let className: ClassName<'isDisabled' | 'isOpen'> = undefined;

  export { className as class };
  export let as: RenderElementTagName = 'div';
  export let element: HTMLElement | undefined = undefined;
  export let disabled: Nullable<boolean> = undefined;
  export let use: Expand<Forwarder.Actions> = [];

  $: resolve = useClassNameResolver(className);
  $: finalClassName = resolve({ isDisabled: disabled ?? false, isOpen: $Open });
</script>

<Render {as} bind:element class={finalClassName} {use} {...$$restProps}>
  {#if $Open}
    <slot name="overlay" overlay={overlay.action} />
  {/if}
  <slot
    allClosed={$AllClosed}
    allOpen={$AllOpen}
    isOpen={$Open}
    isDisabled={disabled}
    overlay={overlay.action}
  />
</Render>
