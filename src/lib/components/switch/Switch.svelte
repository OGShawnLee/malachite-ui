<script lang="ts">
	import type { Action, ClassName, ComponentTagName, Nullable } from "$lib/types";
	import Render from "../render";
	import { createSwitchState } from "./state";
	import { useClassNameResolver } from "$lib/hooks";

	let className: ClassName<"CHECKED" | "DISABLED"> = undefined;

	export let as: ComponentTagName = "button";
	export let element: HTMLElement | undefined = undefined;
	export let checked = false;
	export let disabled: Nullable<boolean> = undefined;
	export let id: string | undefined = undefined;
	export let use: Action[] | undefined = undefined;
	export { className as class };

	const { isChecked, createSwitch, descriptions, labels } = createSwitchState(checked);
	const { binder, action } = createSwitch(id);

	$: isChecked.set(checked);
	$: checked = $isChecked;
	$: isDisabled = disabled ?? false;
	$: finalClassName = useClassNameResolver(className)({ isChecked: $isChecked, isDisabled });
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
	{disabled}
	aria-checked={$isChecked}
	aria-describedby={$descriptions}
	aria-labelledby={$labels}
	role="switch"
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
	<slot isChecked={$isChecked} {isDisabled} switcher={action} />
</Render>
