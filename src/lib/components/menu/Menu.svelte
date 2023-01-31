<script lang="ts">
	import type { Action, ComponentTagName } from "$lib/types";
	import { Render } from "$lib/components";
	import { createMenuState } from "./state";

	let className: string | undefined = undefined;

	export let as: ComponentTagName = "div";
	export let element: HTMLElement | undefined = undefined;
	export let horizontal = false;
	export let infinite = false;
	export let id: string | undefined = undefined;
	export let use: Action[] | undefined = undefined;
	export { className as class };

	const { button, isOpen, navigation, panel } = createMenuState({
		isFinite: !infinite,
		isFocusEnabled: false,
		isVertical: !horizontal,
		isWaiting: true
	});

	$: navigation.isFinite.value = !infinite;
	$: navigation.isVertical.value = !horizontal;
</script>

<Render
	{as}
	class={className}
	{id}
	{...$$restProps}
	bind:element
	actions={use}
	on:blur
	on:change
	on:click
	on:contextmenu
	on:dblclick
	on:focus
	on:focusin
	on:focusout
	on:input
	on:keydown
	on:keypress
	on:keyup
	on:mousedown
	on:mouseenter
	on:mouseleave
	on:mousemove
	on:mouseout
	on:mouseover
	on:mouseup
	on:mousewheel
>
	{#if $isOpen}
		<slot name="up-items" items={panel} />
	{/if}
	<slot {button} isOpen={$isOpen} items={panel} />
	{#if $isOpen}
		<slot name="items" items={panel} />
	{/if}
</Render>
