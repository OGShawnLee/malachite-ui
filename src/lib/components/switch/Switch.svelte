<script lang="ts">
	import Switch from './state';
	import { Render } from '@components';
	import type { Writable } from 'svelte/store';
	import type { Forwarder } from '$lib';
	import { isNotStore } from '@predicate';

	export let checked: Writable<boolean> | boolean = false;

	const { Checked, button, label, description, sync } = new Switch({
		Store: checked,
		initialValue: false,
		notifier: (newValue) => isNotStore(checked) && (checked = newValue)
	});

	$: sync({ previous: $Checked, value: checked });

	let className: Nullable<string> = undefined;

	export { className as class };
	export let as: RenderElementTagName = 'button';
	export let disabled: Nullable<boolean> = undefined;
	export let element: HTMLElement | undefined = undefined;
	export let use: Expand<Forwarder.Actions> = [];

	const { Proxy, action } = button;

	let finalUse: Forwarder.Actions;
	$: finalUse = [...use, [action]];
</script>

<Render {as} bind:element {Proxy} class={className} bind:disabled {...$$restProps} use={finalUse}>
	<slot
		isChecked={$Checked}
		isDisabled={disabled}
		button={button.action}
		label={label.action}
		description={description.action}
	/>
</Render>
