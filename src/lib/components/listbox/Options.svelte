<script lang="ts">
	import type { Action, ComponentTagName } from "$lib/types";
	import Context from "./context";
	import Render from "../render";

	let className: string | undefined = undefined;
	let isLocked = false;

	export let as: ComponentTagName = "ul";
	export let element: HTMLElement | undefined = undefined;
	export let id: string | undefined = undefined;
	export let use: Action[] | undefined = undefined;
	export { className as class };
	export { isLocked as static };

	const { isOpen, createListboxPanel } = Context.getContext();
	const { action, binder } = createListboxPanel(id);

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
		role="listbox"
		tabIndex={0}
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
		<slot panel={action} />
	</Render>
{/if}
