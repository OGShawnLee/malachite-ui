<script lang="ts">
  import type { Action, ClassName, ComponentTagName, Nullable } from '$lib/types';
  import { getContext } from './state';
  import { Render } from '$lib/components';
  import { useClassNameResolver } from '$lib/hooks';
  import { ElementBinder } from '$lib/core';

  let className: ClassName<'DISABLED'> = undefined;

  export let as: ComponentTagName = 'button';
  export let disabled: Nullable<boolean> = undefined;
  export let element: HTMLElement | undefined = undefined;
  export let id: string | undefined = undefined;
  export let use: Action[] | undefined = undefined;
  export { className as class };

  const { createNavigableItem } = getContext();
  const { action, binder } = createNavigableItem(id, new ElementBinder());

  $: actions = use ? [action, ...use] : [action];
  $: isDisabled = disabled ?? false;
  $: finalClassName = useClassNameResolver(className)({ isDisabled });
</script>

<Render
  {as}
  class={finalClassName}
  {id}
  {...$$restProps}
  bind:element
  {binder}
  {disabled}
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
  <slot {isDisabled} item={action} />
</Render>
