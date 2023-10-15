<script lang="ts">
  import type { Action, ComponentTagName, ToastStore } from '$lib/types';
  import Render from '../render';
  import { createToastGroupState } from './state';

  let className: string | undefined = undefined;

  export let as: ComponentTagName = 'div';
  export let element: HTMLElement | undefined = undefined;
  export let id: string | undefined = undefined;
  export let toast: ToastStore<any>;
  export let use: Action[] | undefined = undefined;
  export { className as class };

  const { binder, action } = createToastGroupState(toast)(id);

  $: finalUse = use ? [action, ...use] : [action];
</script>

<Render {as} class={className} {id} {...$$restProps} bind:element {binder} actions={finalUse}>
  <slot toastgroup={action} />
</Render>
