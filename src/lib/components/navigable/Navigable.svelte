<script lang="ts">
	import type { Action, ComponentTagName } from "$lib/types";
	import { Render } from "$lib/components";
	import { createNavigableState } from "./state";

	let className: string | undefined = undefined;

	export let as: ComponentTagName = "div";
	export let element: HTMLElement | undefined = undefined;
	export let finite = false;
	export let index = 0;
	export let global = false;
	export let vertical = false;
	export let id: string | undefined = undefined;
	export let use: Action[] | undefined = undefined;
	export { className as class };

	const { createNavigable, navigation } = createNavigableState({
		initialIndex: index,
		isFinite: finite,
		isGlobal: global,
		isVertical: vertical
	});

	const { action, binder } = createNavigable(id);

	$: actions = use ? [action, ...use] : [action];
	$: navigation.isFinite.value = finite;
	$: navigation.isGlobal.value = global;
	$: navigation.isVertical.value = vertical;
</script>

<Render
	{as}
	class={className}
	{id}
	{...$$restProps}
	bind:element
	{binder}
	{actions}
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
	<slot navigable={action} />
</Render>
