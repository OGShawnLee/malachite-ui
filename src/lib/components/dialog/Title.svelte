<script lang="ts">
	import { Context } from './state';
	import { Render } from '$lib/components';
	import type { Forwarder } from '$lib/types';
	import { Bridge } from '$lib/stores';

	const { action, Proxy } = Context.getContext().initTitle({ Title: new Bridge() });

	let className: Nullable<string> = undefined;

	export { className as class };
	export let as: RenderElementTagName = 'h2';
	export let element: HTMLElement | undefined = undefined;
	export let use: Expand<Forwarder.Actions> = [];

	let finalUse: Forwarder.Actions;
	$: finalUse = [...use, [action]];
</script>

<Render {as} bind:element {Proxy} class={className} {...$$restProps} use={finalUse}>
	<slot title={action} />
</Render>
