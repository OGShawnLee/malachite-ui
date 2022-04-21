<script lang="ts">
	import Switch from './state';
	import { Render } from '@components';
	import type { Forwarder } from '$lib';
	import { Bridge } from '@stores';
	import { GroupContext } from './Group.state';

	const { Checked, initDescription } = Switch.getContext(false) || GroupContext.getContext();
	const { Proxy, action } = initDescription({ Description: new Bridge() });

	let className: Nullable<string> = undefined;

	export { className as class };
	export let as: RenderElementTagName = 'p';
	export let disabled: Nullable<boolean> = undefined;
	export let element: HTMLElement | undefined = undefined;
	export let use: Expand<Forwarder.Actions> = [];

	let finalUse: Forwarder.Actions;
	$: finalUse = [...use, [action]];
</script>

<Render {as} bind:element {Proxy} bind:disabled class={className} use={finalUse} {...$$restProps}>
	<slot isChecked={$Checked} isDisabled={disabled} description={action} />
</Render>
