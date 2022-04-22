<script lang="ts">
	import { Context } from './state';
	import { Render } from '$lib/components';
	import type { Forwarder, Nullable, RenderElementTagName } from '$lib/types';

	const { action, Proxy } = Context.getContext().overlay;

	let className: Nullable<string> = undefined;

	export { className as class };
	export let as: RenderElementTagName = 'div';
	export let element: HTMLElement | undefined = undefined;
	export let use: Expand<Forwarder.Actions> = [];

	let finalUse: Forwarder.Actions;
	$: finalUse = [...use, [action]];
</script>

<Render {as} bind:element {Proxy} class={className} {...$$restProps} use={finalUse}>
	<slot overlay={action} />
</Render>
