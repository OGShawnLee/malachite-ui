<script lang="ts">
	import type { Action, ComponentTagName } from "$lib/types";
	import Render from "../render";
	import { ItemContext } from "./context";

	let className: string | undefined = undefined;
	let isLocked = false;

	export let as: ComponentTagName = "div";
	export let element: HTMLElement | undefined = undefined;
	export let id: string | undefined = undefined;
	export let use: Action[] | undefined = undefined;
	export { className as class };
	export { isLocked as static };

	const {
		isOpen,
		close,
		button: { finalName: buttonName },
		createAccordionPanel
	} = ItemContext.getContext();
	const { action, binder } = createAccordionPanel(id);

	$: finalUse = use ? [action, ...use] : [action];
</script>

{#if $isOpen || isLocked}
	<Render
		{as}
		class={className}
		{id}
		{...$$restProps}
		bind:element
		{binder}
		actions={finalUse}
		aria-labelledby={$buttonName}
		role="region"
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
		<slot panel={action} {close} />
	</Render>
{/if}
