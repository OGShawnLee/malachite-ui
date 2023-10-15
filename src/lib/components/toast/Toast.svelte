<script lang="ts">
    import type { Action, ComponentTagName } from '$lib/types';
    import Render from '../render';
    import { getContext } from './state';
  
    let className: string | undefined = undefined;
  
    export let as: ComponentTagName = 'div';
    export let element: HTMLElement | undefined = undefined;
    export let id: string;
    export let use: Action[] | undefined = undefined;
    export { className as class };
  
    const { mount, close } = getContext()(id);
  
    $: actions = use ? [mount, ...use] : [mount];
  </script>
  
  <Render
    {as}
    class={className}
    {id}
    {...$$restProps}
    bind:element
    {actions}
    role="alert"
  >
    <slot item={mount} {close} />
  </Render>
  