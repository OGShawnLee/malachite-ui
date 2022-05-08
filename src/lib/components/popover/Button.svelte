<script lang="ts">
	import Popover from './state';
	import { Render } from '$lib/components';
	import type { ClassName, Forwarder, Nullable, RenderElementTagName } from '$lib/types';
	import { useClassNameResolver } from '$lib/hooks';

	const { Open, button } = Popover.getContext();
	const { Proxy, action } = button;

	let className: ClassName<'isDisabled' | 'isOpen'> = undefined;

	export { className as class };
	export let as: RenderElementTagName = 'button';
	export let disabled: Nullable<boolean> = undefined;
	export let element: HTMLElement | undefined = undefined;
	export let use: Expand<Forwarder.Actions> = [];

	let finalUse: Forwarder.Actions;
	$: finalUse = [...use, [action]];

	$: resolve = useClassNameResolver(className);
	$: finalClassName = resolve({ isDisabled: disabled ?? false, isOpen: $Open });
</script>

<Render
	{as}
	{Proxy}
	class={finalClassName}
	bind:disabled
	bind:element
	{...$$restProps}
	use={finalUse}
>
	<slot isOpen={$Open} isDisabled={disabled} button={action} />
</Render>
