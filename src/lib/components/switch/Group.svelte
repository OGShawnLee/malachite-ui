<script lang="ts">
	import Group from './Group.state';
	import { Render } from '$lib/components';
	import type { Forwarder, Nullable, RenderElementTagName } from '$lib/types';

	const { Checked, label, description } = new Group();

	let className: Nullable<string> = undefined;

	export { className as class };
	export let as: RenderElementTagName = 'slot';
	export let disabled: Nullable<boolean> = undefined;
	export let element: HTMLElement | undefined = undefined;
	export let use: Expand<Forwarder.Actions> = [];
</script>

<Render {as} bind:element bind:disabled class={className} {use} {...$$restProps}>
	<slot
		isChecked={$Checked}
		isDisabled={disabled}
		label={label.action}
		description={description.action}
	/>
</Render>
