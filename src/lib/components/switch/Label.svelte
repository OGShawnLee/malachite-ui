<script lang="ts">
	import type { Action, ComponentTagName } from "$lib/types";
	import Context from "./Group.context";
	import Render from "../render";
	import { ElementBinder } from "$lib/core";

	let className: string | undefined = undefined;

	export let as: ComponentTagName = "label";
	export let element: HTMLElement | undefined = undefined;
	export let id: string | undefined = undefined;
	export let passive = false;
	export let use: Action[] | undefined = undefined;
	export { className as class };

	const {
		isChecked,
		createSwitchLabel,
		button: { finalName }
	} = Context.getContext();
	const { binder, action, context: isPassive } = createSwitchLabel(id, new ElementBinder());

	$: isPassive.set(passive);
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
	for={$finalName}
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
	<slot isChecked={$isChecked} label={action} />
</Render>
