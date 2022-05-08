<script lang="ts">
	import { Context } from './state';
	import { Render } from '$lib/components';
	import type { ClassName, Expand, Forwarder, Nullable, RenderElementTagName } from '$lib/types';
	import { Bridge } from '$lib/stores';
	import { onMount } from 'svelte';
	import { useClassNameResolver } from '$lib/hooks';

	const Proxy = new Bridge();
	const { Index, initPanel } = Context.getContext();
	const { Disabled, index, action } = initPanel(Proxy);

	let className: ClassName<'isDisabled'> = undefined;

	export { className as class };
	export let as: RenderElementTagName = 'div';
	export let element: HTMLElement | undefined = undefined;
	export let disabled: Nullable<boolean> = undefined;
	export let use: Expand<Forwarder.Actions> = [];

	let isMounted = false;
	onMount(() => (isMounted = true));

	let finalUse: Forwarder.Actions;
	$: finalUse = [...use, [action]];

	$: resolve = useClassNameResolver(className);
	$: finalClassName = resolve({ isDisabled: disabled ?? false });
</script>

{#if $Index === index && isMounted && !$Disabled}
	<Render
		{as}
		{Proxy}
		bind:element
		bind:disabled
		class={finalClassName}
		use={finalUse}
		{...$$restProps}
	>
		<slot isDisabled={disabled ?? false} panel={action} />
	</Render>
{/if}
