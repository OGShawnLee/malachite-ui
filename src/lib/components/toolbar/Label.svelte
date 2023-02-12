<script lang="ts">
	import type { Action, ComponentTagName } from "$lib/types";
	import Context from "./Group.context";
	import { Render } from "$lib/components";
	import { ElementBinder } from "$lib/core";

	let className: string | undefined = undefined;

	export let as: ComponentTagName = "label";
	export let element: HTMLElement | undefined = undefined;
	export let id: string | undefined = undefined;
	export let use: Action[] | undefined = undefined;
	export { className as class };

	const { createToolbarLabel } = Context.getContext();
	const { binder, action, context: toolbarName } = createToolbarLabel(id, new ElementBinder());

	$: finalUse = use ? [action, ...use] : [action];
</script>

<Render
	{as}
	class={className}
	{id}
	{...$$restProps}
	bind:element
	{binder}
	actions={finalUse}
	for={$toolbarName}
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
	<slot label={action} />
</Render>
