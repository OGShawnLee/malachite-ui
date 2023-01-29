<script lang="ts">
  import type { Action, ComponentTagName } from '$lib/types';
  import { getContext } from './state';
  import { Render } from '$lib/components';

  let className: string | undefined = undefined;
  let isLocked = false;

  export let as: ComponentTagName = 'div';
  export let element: HTMLElement | undefined = undefined;
  export let id: string | undefined = undefined;
  export let use: Action[] | undefined = undefined;
  export { className as class };
  export { isLocked as static };

  const { isOpen, close, createDisclosurePanel } = getContext();
  const { action, binder } = createDisclosurePanel(id);

  $: actions = use ? [action, ...use] : [action];
</script>

{#if $isOpen || isLocked}
  <Render
    {as}
    class={className}
    {id}
    {...$$restProps}
    bind:element
    {binder}
    {actions}
    on:blur
    on:change
    on:click
    on:contextmenu
    on:dblclick
    on:focus
    on:focusin
    on:focusout
    on:input
    on:keydown
    on:keypress
    on:keyup
    on:mousedown
    on:mouseenter
    on:mouseleave
    on:mousemove
    on:mouseout
    on:mouseover
    on:mouseup
    on:mousewheel
  >
    <slot panel={action} {close} />
  </Render>
{/if}
