<script lang="ts">
	import type { Action, ComponentTagName } from "$lib/types";
	import Context from "./context";
	import Render from "../render";
	import { ElementBinder } from "$lib/core";

	let className: string | undefined = undefined;

	export let as: ComponentTagName = "p";
	export let element: HTMLElement | undefined = undefined;
	export let id: string | undefined = undefined;
	export let use: Action[] | undefined = undefined;
	export { className as class };

	const { createDialogDescription } = Context.getContext();
	const { binder, action } = createDialogDescription(id, new ElementBinder());

	$: actions = use ? [action, ...use] : [action];
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
	<slot description={action} />
</Render>