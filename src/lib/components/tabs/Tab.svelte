<script lang="ts">
	import { Context } from './state';
	import { Render } from '$lib/components';
	import type { Expand, Forwarder, Nullable, RenderElementTagName } from '$lib/types';
	import { Bridge } from '$lib/stores';

	const Proxy = new Bridge();
	const tab = Context.getContext().initTab(Proxy).action;

	const { Active, Disabled, Selected } = Proxy;

	let className: Nullable<string> = undefined;
	export { className as class };
	export let as: RenderElementTagName = 'button';
	export let element: HTMLElement | undefined = undefined;
	export let disabled: Nullable<boolean> = undefined;
	export let use: Expand<Forwarder.Actions> = [];

	let finalUse: Forwarder.Actions;
	$: finalUse = [...use, [tab]];
</script>

<Render {as} {Proxy} bind:element bind:disabled class={className} use={finalUse} {...$$restProps}>
	<slot isDisabled={$Disabled ?? false} isActive={$Active} isSelected={$Selected} {tab} />
</Render>
