<script lang="ts">
	import type { Action, ClassName, ComponentTagName, Nullable } from "$lib/types";
	import Render from "../render";
	import { ItemContext } from "./context";
	import { useClassNameResolver } from "$lib/hooks";

	let className: ClassName<"DISABLED" | "OPEN"> = undefined;

	export let as: ComponentTagName = "button";
	export let element: HTMLElement | undefined = undefined;
	export let id: string | undefined = undefined;
	export let disabled: Nullable<boolean> = undefined;
	export let use: Action[] | undefined = undefined;
	export { className as class };

	const {
		isOpen,
		createAccordionButton,
		panel: { finalName: panelName }
	} = ItemContext.getContext();
	const { action, binder } = createAccordionButton(id);

	$: isDisabled = disabled ?? false;
	$: finalClassName = useClassNameResolver(className)({ isOpen: $isOpen, isDisabled });
	$: finalUse = use ? [action, ...use] : [action];
</script>

<Render
	{as}
	class={finalClassName}
	{id}
	{...$$restProps}
	bind:element
	{binder}
	actions={finalUse}
	aria-expanded={$isOpen}
	aria-controls={$panelName}
	aria-disabled={disabled}
	{disabled}
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
