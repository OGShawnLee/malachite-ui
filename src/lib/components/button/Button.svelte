<script lang="ts">
	import type { Action, ClassName, ComponentTagName, Nullable } from "$lib/types";
	import { Render } from "$lib/components";
	import { useClassNameResolver } from "$lib/hooks";
	import { createButtonState } from "./state";

	let className: ClassName<"DISABLED" | "PRESSED"> = undefined;

	export let as: ComponentTagName = "button";
	export let element: HTMLElement | undefined = undefined;
	export let id: string | undefined = undefined;
	export let pressed = false;
	export let disabled: Nullable<boolean> = undefined;
	export let use: Action[] | undefined = undefined;
	export { className as class };

	const { isPressed, createButton } = createButtonState(pressed);
	const { action, binder } = createButton(id);

	$: actions = use ? [action, ...use] : [action];
	$: isPressed.set(pressed);
	$: pressed = $isPressed;
	$: isDisabled = disabled ?? false;
	$: finalClassName = useClassNameResolver(className)({ isDisabled, isPressed: $isPressed });
</script>

<Render
	{as}
	class={finalClassName}
	{id}
	{...$$restProps}
	bind:element
	{binder}
	{actions}
	aria-pressed={$isPressed}
	role="button"
	type="button"
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
	<slot {isDisabled} isPressed={$isPressed} button={action} />
</Render>
