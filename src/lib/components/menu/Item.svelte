<script lang="ts">
	import { Context } from './state';
	import { Render } from '$lib/components';
	import type { Forwarder, Nullable, RenderElementTagName } from '$lib/types';
	import { Bridge } from '$lib/stores';

	const { initItem, close } = Context.getContext();
	const { Proxy, action } = initItem(new Bridge());
	const { Selected } = Proxy;

	let className: Nullable<string> = undefined;
	export { className as class };
	export let as: RenderElementTagName = 'li';
	export let disabled: Nullable<boolean> = undefined;
	export let element: HTMLElement | undefined = undefined;
	export let use: Expand<Forwarder.Actions> = [];

	let finalUse: Forwarder.Actions;
	$: finalUse = [...use, [action]];
</script>

<Render
	{as}
	{Proxy}
	bind:element
	{disabled}
	class={className}
	use={finalUse}
	{...$$restProps}
	on:click={close}
	on:click
>
	<slot isDisabled={disabled ?? false} isSelected={$Selected} item={action} />
</Render>
