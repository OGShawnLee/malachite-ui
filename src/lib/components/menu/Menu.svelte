<script lang="ts">
	import Menu from './state';
	import { Render } from '$lib/components';
	import type { Readable } from 'svelte/store';
	import type { Forwarder, Nullable, RenderElementTagName } from '$lib/types';
	import { storable } from '$lib/stores';

	export let order: Readable<boolean> | boolean = false;
	export let horizontal: Readable<boolean> | boolean = false;
	export let finite: Readable<boolean> | boolean = false;

	const Horizontal = storable({ Store: horizontal, initialValue: false });

	const { Open, Finite, ShouldOrder, Vertical, button, items } = new Menu({
		Finite: finite,
		ShouldOrder: order,
		Vertical: true
	});

	$: Finite.sync({ previous: $Finite, value: finite });
	$: Horizontal.sync({ previous: $Horizontal, value: horizontal });
	$: Vertical.sync({ previous: $Vertical, value: !$Horizontal });
	$: ShouldOrder.sync({ previous: $ShouldOrder, value: order });

	let className: Nullable<string> = undefined;
	export { className as class };
	export let as: RenderElementTagName = 'slot';
	export let disabled: Nullable<boolean> = undefined;
	export let element: HTMLElement | undefined = undefined;
	export let use: Expand<Forwarder.Actions> = [];
</script>

<Render {as} bind:element {disabled} class={className} {use} {...$$restProps}>
	{#if $Open}
		<slot name="up-items" isDisabled={disabled ?? false} items={items.action} />
	{/if}
	<slot isOpen={$Open} isDisabled={disabled ?? false} button={button.action} items={items.action} />
	{#if $Open}
		<slot name="items" isDisabled={disabled ?? false} items={items.action} />
	{/if}
</Render>
