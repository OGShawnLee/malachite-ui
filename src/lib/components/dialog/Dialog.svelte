<script lang="ts">
	import type { Action, ComponentTagName, Nullable } from "$lib/types";
	import { Render } from "$lib/components";
	import { createDialogState } from "./state";
	import { ref } from "$lib/utils";
	import { isClient } from "$lib/predicate";

	let className: string | undefined = undefined;

	export let as: ComponentTagName = "div";
	export let element: HTMLElement | undefined = undefined;
	export let initialFocus: Nullable<HTMLElement> = undefined;
	export let open = false;
	export let id: string | undefined = undefined;
	export let use: Action[] | undefined = undefined;
	export { className as class };

	const initialFocusRef = ref(initialFocus);
	const { isOpen, content, close, createDialogRoot, overlay } = createDialogState(
		open,
		initialFocusRef
	);
	const { action, binder } = createDialogRoot(id);

	$: actions = use ? [action, ...use] : [action];
	$: isOpen.set(open);
	$: open = $isOpen;
	$: initialFocusRef.set(initialFocus);
</script>

{#if $isOpen && isClient()}
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
		<slot dialog={action} {content} {close} {overlay} />
	</Render>
{/if}