<script lang="ts">
	import Group from './Group.state';
	import { Render } from '@components';
	import type { Forwarder } from '$lib';
	import type { Readable } from 'svelte/store';
	import { storable } from '@stores';
	import { onMount } from 'svelte';

	export let expanded: Readable<boolean> | boolean = false;

	const Expanded = storable({ Store: expanded, initialValue: false });
	$: Expanded.sync({ previous: $Expanded, value: expanded });

	const State = new Group({ mode: Group.getMode($Expanded) });
	$: State.mode = Group.getMode($Expanded);

	onMount(State.listen.bind(State));

	const { AllClosed, AllOpen, Open, overlay } = State;

	export let className: Nullable<string> = undefined;

	export { className as class };
	export let as: RenderElementTagName = 'div';
	export let element: HTMLElement | undefined = undefined;
	export let disabled: Nullable<boolean> = undefined;
	export let use: Expand<Forwarder.Actions> = [];
</script>

<Render {as} bind:element class={className} {use} {...$$restProps}>
	{#if $Open}
		<slot name="overlay" overlay={overlay.action} />
	{/if}
	<slot
		allClosed={$AllClosed}
		allOpen={$AllOpen}
		isOpen={$Open}
		isDisabled={disabled}
		overlay={overlay.action}
	/>
</Render>
