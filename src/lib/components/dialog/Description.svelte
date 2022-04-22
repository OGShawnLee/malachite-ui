<script lang="ts">
	import { Context } from './state';
	import { Render } from '@components';
	import type { Forwarder } from '$lib/types';
	import { Bridge } from '@stores';

	const { action, Proxy } = Context.getContext().initDescription({ Description: new Bridge() });

	let className: Nullable<string> = undefined;

	export { className as class };
	export let as: RenderElementTagName = 'p';
	export let element: HTMLElement | undefined = undefined;
	export let use: Expand<Forwarder.Actions> = [];

	let finalUse: Forwarder.Actions;
	$: finalUse = [...use, [action]];
</script>

<Render {as} bind:element {Proxy} class={className} {...$$restProps} use={finalUse}>
	<slot description={action} />
</Render>
