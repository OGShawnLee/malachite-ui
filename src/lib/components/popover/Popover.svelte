<script lang="ts">
	import Popover from './state';
	import { Render } from '$lib/components';
	import type { Forwarder } from '$lib/types';
	import type { Readable } from 'svelte/store';

	export let forceFocus: Readable<boolean> | boolean = false;

	const { Open, ForceFocus, ShowOverlay, close, button, overlay, panel } = new Popover({
		ForceFocus: {
			Store: forceFocus,
			initialValue: false,
			notifier: (newValue) => (forceFocus = newValue)
		}
	});

	$: ForceFocus.sync({ previous: $ForceFocus, value: forceFocus });

	let className: Nullable<string> = undefined;

	export { className as class };
	export let as: RenderElementTagName = 'div';
	export let disabled: Nullable<boolean> = undefined;
	export let element: HTMLElement | undefined = undefined;
	export let use: Expand<Forwarder.Actions> = [];
</script>

<Render {as} bind:element class={className} {...$$restProps} {use}>
	{#if $Open && $ShowOverlay}
		<slot name="overlay" overlay={overlay.action} />
	{/if}
	{#if $Open}
		<slot name="up-panel" panel={panel.action} {close} />
	{/if}
	<slot
		isOpen={$Open}
		isDisabled={disabled}
		overlay={overlay.action}
		button={button.action}
		panel={panel.action}
		{close}
	/>
	{#if $Open}
		<slot name="panel" panel={panel.action} {close} />
	{/if}
</Render>
