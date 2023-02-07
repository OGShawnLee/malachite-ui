<script lang="ts">
	import type { Action, ComponentTagName } from "$lib/types";
	import { Render } from "$lib/components";
	import { createRadioGroupState } from "./state";

	let className: string | undefined = undefined;

	export let as: ComponentTagName = "div";
	export let element: HTMLElement | undefined = undefined;
	export let id: string | undefined = undefined;
	export let horizontal = false;
	export let use: Action[] | undefined = undefined;
	export let value = "";
	export { className as class };

	const { createRadioGroup, descriptions, labels, navigation, globalValue } = createRadioGroupState(
		{
			initialValue: value,
			isVertical: !horizontal,
			isWaiting: true
		}
	);
	const { action, binder } = createRadioGroup(id);

	$: finalUse = use ? [action, ...use] : [action];
	$: navigation.isVertical.set(!horizontal);
	$: value = $globalValue;
</script>

<Render
	{as}
	class={className}
	{id}
	{...$$restProps}
	bind:element
	{binder}
	actions={finalUse}
	aria-describedby={$descriptions}
	aria-labelledby={$labels}
	role="radiogroup"
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
	<slot radio-group={action} value={$globalValue}/>
</Render>
