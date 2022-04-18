<script lang="ts">
	import { CONTEXT } from './state';
	import { Render } from '@components';
	import type { Forwarder } from '$lib';

	const { Open, button } = CONTEXT.getContext();
	const { Proxy, action } = button;

	let className: Nullable<string> = undefined;

	export { className as class };
	export let as: RenderElementTagName = 'button';
	export let disabled: Nullable<boolean> = undefined;
	export let element: HTMLElement | undefined = undefined;
	export let use: Expand<Forwarder.Actions> = [];

	let finalUse: Forwarder.Actions;
	$: finalUse = [...use, [action]];
</script>

<Render {as} {Proxy} class={className} bind:disabled bind:element {...$$restProps} use={finalUse}>
	<slot isOpen={$Open} isDisabled={disabled} button={action} />
</Render>
