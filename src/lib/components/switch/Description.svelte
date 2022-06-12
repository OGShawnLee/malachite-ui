<script lang="ts">
  import Switch from './state';
  import { Render } from '$lib/components';
  import type { ClassName, Expand, Forwarder, Nullable, RenderElementTagName } from '$lib/types';
  import { Bridge } from '$lib/stores';
  import { GroupContext } from './Group.state';
  import { useClassNameResolver } from '$lib/hooks';

  const { Checked, initDescription } = Switch.getContext(false) || GroupContext.getContext();
  const { Proxy, action } = initDescription({ Description: new Bridge() });

  let className: ClassName<'isChecked' | 'isDisabled'> = undefined;

  export { className as class };
  export let as: RenderElementTagName = 'p';
  export let disabled: Nullable<boolean> = undefined;
  export let element: HTMLElement | undefined = undefined;
  export let use: Expand<Forwarder.Actions> = [];

  let finalUse: Forwarder.Actions;
  $: finalUse = [...use, [action]];

  $: isDisabled = disabled ?? false;
  $: resolve = useClassNameResolver(className);
  $: finalClassName = resolve({ isChecked: $Checked, isDisabled });
</script>

<Render
  {as}
  bind:element
  {Proxy}
  bind:disabled
  class={finalClassName}
  use={finalUse}
  {...$$restProps}
>
  <slot isChecked={$Checked} {isDisabled} description={action} />
</Render>
