<script lang="ts">
	import { Context } from './state';
	import { Render } from '$lib/components';
	import type { Expand, Forwarder, Nullable, RenderElementTagName } from '$lib/types';

	const { Proxy, action } = Context.getContext().tabList;

	let className: Nullable<string> = undefined;
	export { className as class };
	export let as: RenderElementTagName = 'div';
	export let element: HTMLElement | undefined = undefined;
	export let disabled: Nullable<boolean> = undefined;
	export let use: Expand<Forwarder.Actions> = [];

	let finalUse: Forwarder.Actions;
	$: finalUse = [...use, [action]];
</script>

<Render {as} {Proxy} bind:element bind:disabled class={className} use={finalUse} {...$$restProps}>
	<slot isDisabled={disabled ?? false} tabList={action} />
</Render>
