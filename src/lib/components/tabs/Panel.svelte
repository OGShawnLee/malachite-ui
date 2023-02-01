<script lang="ts">
	import type { Action, ComponentTagName } from "$lib/types";
	import { getContext } from "./state";
	import { Render } from "$lib/components";
	import { ElementBinder } from "$lib/core";

	let className: string | undefined = undefined;

	export let as: ComponentTagName = "div";
	export let element: HTMLElement | undefined = undefined;
	export let id: string | undefined = undefined;
	export let use: Action[] | undefined = undefined;
	export { className as class };

	const { index, createPanel } = getContext();
	const {
		action,
		binder,
		context: {
			index: panelIndex,
			binder: { finalName: tabFinalName }
		}
	} = createPanel(id, new ElementBinder());

	$: finalUse = use ? [action, ...use] : [action];
</script>

{#if $index === panelIndex}
	<Render
		{as}
		class={className}
		{id}
		{...$$restProps}
		bind:element
		{binder}
		actions={finalUse}
		aria-labelledby={$tabFinalName}
		role="tabpanel"
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
