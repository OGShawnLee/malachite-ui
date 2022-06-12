<script lang="ts">
  import Group from './Group.state';
  import { Render } from '$lib/components';
  import type { ClassName, Expand, Forwarder, Nullable, RenderElementTagName } from '$lib/types';
  import { useClassNameResolver } from '$lib/hooks';

  const { Checked, label, description } = new Group();

  let className: ClassName<'isChecked' | 'isDisabled'> = undefined;

  export { className as class };
  export let as: RenderElementTagName = 'slot';
  export let disabled: Nullable<boolean> = undefined;
  export let element: HTMLElement | undefined = undefined;
  export let use: Expand<Forwarder.Actions> = [];

  $: isDisabled = disabled ?? false;
  $: finalClassName = useClassNameResolver(className)({ isChecked: $Checked, isDisabled });
</script>

<Render {as} bind:element bind:disabled class={finalClassName} {use} {...$$restProps}>
  <slot isChecked={$Checked} {isDisabled} label={label.action} description={description.action} />
</Render>
