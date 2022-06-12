<script lang="ts">
  import Switch from './state';
  import { Render } from '$lib/components';
  import type { Writable } from 'svelte/store';
  import type { ClassName, Expand, Forwarder, Nullable, RenderElementTagName } from '$lib/types';
  import { isNotStore } from '$lib/predicate';
  import { useClassNameResolver } from '$lib/hooks';

  export let checked: Writable<boolean> | boolean = false;

  const { Checked, button, label, description, sync } = new Switch({
    Store: checked,
    initialValue: false,
    notifier: (newValue) => isNotStore(checked) && (checked = newValue)
  });

  $: sync({ previous: $Checked, value: checked });

  let className: ClassName<'isDisabled' | 'isChecked'> = undefined;

  export { className as class };
  export let as: RenderElementTagName = 'button';
  export let disabled: Nullable<boolean> = undefined;
  export let element: HTMLElement | undefined = undefined;
  export let use: Expand<Forwarder.Actions> = [];

  const { Proxy, action } = button;

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
  class={finalClassName}
  bind:disabled
  {...$$restProps}
  use={finalUse}
  on:click
>
  <slot
    isChecked={$Checked}
    {isDisabled}
    button={button.action}
    label={label.action}
    description={description.action}
  />
</Render>
