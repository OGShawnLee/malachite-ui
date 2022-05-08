<script lang="ts">
	import { Context } from './state';
	import { Render } from '$lib/components';
	import type { ClassName, Expand, Forwarder, Nullable, RenderElementTagName } from '$lib/types';
	import { useClassNameResolver } from '$lib/hooks';

	const { Proxy, action } = Context.getContext().tabList;

	let className: ClassName<'isDisabled'> = undefined;

	export { className as class };
	export let as: RenderElementTagName = 'div';
	export let element: HTMLElement | undefined = undefined;
	export let disabled: Nullable<boolean> = undefined;
	export let use: Expand<Forwarder.Actions> = [];

	let finalUse: Forwarder.Actions;
	$: finalUse = [...use, [action]];

	$: resolve = useClassNameResolver(className);
	$: finalClassName = resolve({ isDisabled: disabled ?? false });
</script>

<Render
	{as}
	{Proxy}
	bind:element
	bind:disabled
	class={finalClassName}
	use={finalUse}
	{...$$restProps}
>
	<slot isDisabled={disabled ?? false} tabList={action} />
</Render>
