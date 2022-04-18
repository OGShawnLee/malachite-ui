<script lang="ts">
	import Popover from './state';
	import { Render } from '@components';
	import type { Forwarder } from '$lib';

	const { Open, overlay } = Popover.getContext();
	const { Proxy, action } = overlay;

	let className: Nullable<string> = undefined;

	export { className as class };
	export let as: RenderElementTagName = 'div';
	export let disabled: Nullable<boolean> = undefined;
	export let element: HTMLElement | undefined = undefined;
	export let use: Expand<Forwarder.Actions> = [];

	let finalUse: Forwarder.Actions;
	$: finalUse = [...use, [action]];
</script>

{#if $Open}
	<Render {as} {Proxy} class={className} bind:disabled bind:element {...$$restProps} use={finalUse}>
		<slot isOpen={$Open} isDisabled={disabled} overlay={action} />
	</Render>
{/if}
