<script lang="ts">
	import { CONTEXT } from './state';
	import { Render } from '@components';
	import type { Action } from 'svelte/action';
	import type { Forwarder } from '$lib';

	const { Open, panel, close } = CONTEXT.getContext();
	const { Proxy, action } = panel;

	let className: Nullable<string> = undefined;

	export { className as class };
	export let as: RenderElementTagName = 'div';
	export let disabled: Nullable<boolean> = undefined;
	export let element: HTMLElement | undefined = undefined;
	export let use: [action: Action, parameter?: any][] = [];

	let finalUse: Forwarder.Actions;
	$: finalUse = [...use, [action]];
</script>

{#if $Open}
	<Render {as} {Proxy} class={className} bind:disabled bind:element {...$$restProps} use={finalUse}>
		<slot isOpen={$Open} isDisabled={disabled} panel={action} {close} />
	</Render>
{/if}
