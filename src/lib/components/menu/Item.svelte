<script lang="ts">
	import type { Action, ClassName, ComponentTagName, Nullable } from "$lib/types";
	import Render from "../render";
	import { getContext } from "./state";
	import { useClassNameResolver } from "$lib/hooks";
	import { ElementBinder } from "$lib/core";

	let className: ClassName<"ACTIVE" | "DISABLED"> = undefined;

	export let as: ComponentTagName = "button";
	export let disabled: Nullable<boolean> = undefined;
	export let element: HTMLElement | undefined = undefined;
	export let id: string | undefined = undefined;
	export let value = "";
	export let use: Action[] | undefined = undefined;
	export { className as class };

	const { createMenuItem } = getContext();
	const { action, binder } = createMenuItem(value, new ElementBinder());
	const { isActive } = binder;

	$: finalUse = use ? [action, ...use] : [action];
	$: isDisabled = disabled ?? false;
	$: finalClassName = useClassNameResolver(className)({
		isDisabled,
		isActive: $isActive
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
	{disabled}
	role="menuitem"
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
	<slot {isDisabled} isActive={$isActive} item={action} />
</Render>
