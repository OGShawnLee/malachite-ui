<script lang="ts">
	import type { Action, ClassName, ComponentTagName, Nullable } from "$lib/types";
	import { getContext } from './state'
	import { Render } from "$lib/components";
	import { useClassNameResolver } from "$lib/hooks";

	let className: ClassName<"DISABLED" | "OPEN"> = undefined;

	export let as: ComponentTagName = "button";
	export let element: HTMLElement | undefined = undefined;
	export let id: string | undefined = undefined;
	export let disabled: Nullable<boolean> = undefined;
	export let use: Action[] | undefined = undefined;
	export { className as class };

	const { isOpen, createDisclosureButton } = getContext();
	const { action, binder, context: panelName } = createDisclosureButton(id);

	$: actions = use ? [action, ...use] : [action];
	$: isDisabled = disabled ?? false
	$: finalClassName = useClassNameResolver(className)({
		isOpen: $isOpen,
		isDisabled
	});
</script>

<Render
	{as}
	class={finalClassName}
	{id}
	{...$$restProps}
	bind:element
	{binder}
	{actions}
	aria-expanded={$isOpen}
	aria-controls={$panelName}
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
	<slot isOpen={$isOpen} {isDisabled} button={action} />
</Render>