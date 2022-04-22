<script lang="ts">
	import Render from '$lib/components/render';
	import type { Nullable, RenderElementTagName } from '$lib/types';
	import { Bridge } from '$lib/stores';
	import { onMount } from 'svelte';

	export let Proxy: Bridge = new Bridge();

	export let as: RenderElementTagName = 'div';
	export let disabled: Nullable<boolean> = undefined;
	export let receiveDisabled: (isDisabled: Nullable<boolean>) => void = () => {};
	export let receiveElement: (element: HTMLElement | undefined) => void = () => {};

	let element: HTMLElement | undefined;
	$: receiveElement(element);

	onMount(() => {
		receiveDisabled(disabled);
	});
</script>

<Render {as} {Proxy} bind:element bind:disabled data-testid={`render-${as}`} />
