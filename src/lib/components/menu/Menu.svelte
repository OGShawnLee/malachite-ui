<script lang="ts">
  import Menu from './state';
  import { Render } from '$lib/components';
  import type { Readable } from 'svelte/store';
  import type { ClassName, Expand, Forwarder, Nullable, RenderElementTagName } from '$lib/types';
  import { storable } from '$lib/stores';
  import { useClassNameResolver } from '$lib/hooks';

  export let order: Readable<boolean> | boolean = false;
  export let horizontal: Readable<boolean> | boolean = false;
  export let finite: Readable<boolean> | boolean = false;

  const Horizontal = storable({ Store: horizontal, initialValue: false });

  const { Open, Finite, ShouldOrder, Vertical, button, items } = new Menu({
    Finite: finite,
    ShouldOrder: order,
    Vertical: true
  });

  $: Finite.sync({ previous: $Finite, value: finite });
  $: Horizontal.sync({ previous: $Horizontal, value: horizontal });
  $: Vertical.sync({ previous: $Vertical, value: !$Horizontal });
  $: ShouldOrder.sync({ previous: $ShouldOrder, value: order });

  let className: ClassName<'isDisabled' | 'isOpen'> = undefined;

  export { className as class };
  export let as: RenderElementTagName = 'slot';
  export let disabled: Nullable<boolean> = undefined;
  export let element: HTMLElement | undefined = undefined;
  export let use: Expand<Forwarder.Actions> = [];

  $: isDisabled = disabled ?? false;
  $: resolve = useClassNameResolver(className);
  $: finalClassName = resolve({ isDisabled, isOpen: $Open });
</script>

<Render {as} bind:element {disabled} class={finalClassName} {use} {...$$restProps}>
  {#if $Open}
    <slot name="up-items" {isDisabled} items={items.action} />
  {/if}
  <slot isOpen={$Open} {isDisabled} button={button.action} items={items.action} />
  {#if $Open}
    <slot name="items" {isDisabled} items={items.action} />
  {/if}
</Render>
