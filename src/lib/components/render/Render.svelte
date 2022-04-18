<script lang="ts">
	import type { Forwarder } from '$lib';
	import { forwardActions } from '@core';
	import { Bridge } from '$lib/stores';
	import { onMount } from 'svelte';

	let className: Nullable<string> = undefined;

	export { className as class };
	export let as: RenderElementTagName = 'slot';
	export let disabled: Nullable<boolean> = undefined;
	export let element: HTMLElement | null = null;
	export let use: Expand<Forwarder.Actions> = [];

	export let Proxy: Bridge = new Bridge();

	const { Disabled } = Proxy;

	$: isUsingSlot = as === 'slot';
	$: if (isUsingSlot && element) {
		if (className) element.className = className;
	}
	onMount(() =>
		Disabled.subscribe((isDisabled) => {
			if (isDisabled !== disabled) disabled = isDisabled;
		})
	);

	$: Proxy.isUsingSlot = isUsingSlot;
	Proxy.onChange = (el) => (element = el);
	$: Proxy.sync({ disabled });
</script>

{#if as === 'slot'}
	<slot />
{:else}
	<svelte:element
		this={as}
		bind:this={element}
		class={className}
		{disabled}
		use:forwardActions={use}
		{...$$restProps}
	>
		<slot />
	</svelte:element>
{/if}
