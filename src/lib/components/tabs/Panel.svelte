<script lang="ts">
	import { Context } from './state';
	import { Render } from '$lib/components';
	import type { Expand, Forwarder, Nullable, RenderElementTagName } from '$lib/types';
	import { Bridge } from '$lib/stores';
	import { onMount } from 'svelte';

	const Proxy = new Bridge();
	const { Index, initPanel } = Context.getContext();
	const { Disabled, index, action } = initPanel(Proxy);

	let className: Nullable<string> = undefined;
	export { className as class };
	export let as: RenderElementTagName = 'div';
	export let element: HTMLElement | undefined = undefined;
	export let disabled: Nullable<boolean> = undefined;
	export let use: Expand<Forwarder.Actions> = [];

	let isMounted = false;
	onMount(() => (isMounted = true));

	let finalUse: Forwarder.Actions;
	$: finalUse = [...use, [action]];
</script>

{#if $Index === index && isMounted && !$Disabled}
	<Render {as} {Proxy} bind:element bind:disabled class={className} use={finalUse} {...$$restProps}>
		<slot isDisabled={disabled ?? false} panel={action} />
	</Render>
{/if}
