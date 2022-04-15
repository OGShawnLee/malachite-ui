<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	
    export let Child: typeof SvelteComponent;

	export let setContext: () => void = () => {};
	export let getContext: () => unknown;
	export let receiveContext: (value: unknown) => void = () => {};
	
    setContext();
</script>

<svelte:component this={Child} {getContext} {receiveContext}>
	<slot />
</svelte:component>