<script lang="ts">
	import type { Action, ClassName, ComponentTagName, Nullable } from "$lib/types";
	import Context from "./context";
	import { Render } from "$lib/components";
	import { useClassNameResolver } from "$lib/hooks";
	import { ElementBinder } from "$lib/core";

	let className: ClassName<"ACTIVE" | "DISABLED" | "SELECTED"> = undefined;

	export let as: ComponentTagName = "li";
	export let disabled: Nullable<boolean> = undefined;
	export let element: HTMLElement | undefined = undefined;
	export let id: string | undefined = undefined;
	export let use: Action[] | undefined = undefined;
	export let value = "";
	export { className as class };

	const { createListboxOptionState } = Context.getContext();
	const { createListboxOption } = createListboxOptionState(value, disabled);
	const { action, binder } = createListboxOption(id, new ElementBinder());
	const { isActive, isSelected } = binder;

	$: isDisabled = disabled ?? false;
	$: finalUse = use ? [action, ...use] : [action];
	$: finalClassName = useClassNameResolver(className)({
		isActive: $isActive,
		isDisabled,
		isSelected: $isSelected
	});
</script>

<Render
	{as}
	class={finalClassName}
	{id}
	{...$$restProps}
	bind:element
	{binder}
	actions={finalUse}
	aria-selected={$isSelected}
	{disabled}
	role="option"
	tabIndex={-1}
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
	<slot {isDisabled} isActive={$isActive} isSelected={$isSelected} option={action} />
</Render>
