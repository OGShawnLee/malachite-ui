<script lang="ts">
	import type { Action, ClassName, ComponentTagName, Nullable } from "$lib/types";
	import Render from "../render";
	import { getContext } from "./state";
	import { useClassNameResolver } from "$lib/hooks";

	let className: ClassName<"DISABLED" | "OPEN"> = undefined;

	export let as: ComponentTagName = "button";
	export let element: HTMLElement | undefined = undefined;
	export let id: string | undefined = undefined;
	export let disabled: Nullable<boolean> = undefined;
	export let use: Action[] | undefined = undefined;
	export let nofocus = false
	export { className as class };

	const { isOpen, createMenuButton, noButtonFocus } = getContext();
	const { action, binder } = createMenuButton(id);

	$: finalUse = use ? [action, ...use] : [action];
	$: isDisabled = disabled ?? false;
	$: finalClassName = useClassNameResolver(className)({ isDisabled, isOpen: $isOpen });
	$: noButtonFocus.set(nofocus)
</script>

<Render
	{as}
	class={finalClassName}
	{id}
	{...$$restProps}
	bind:element
	{binder}
	actions={finalUse}
	aria-haspopup="true"
	aria-expanded={$isOpen}
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
	<slot {isDisabled} isOpen={$isOpen} button={action} />
</Render>
