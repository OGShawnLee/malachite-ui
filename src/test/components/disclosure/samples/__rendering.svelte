<script lang="ts">
	import type { Forwarder } from '$lib';
	import { Disclosure, DisclosureButton, DisclosurePanel } from '@components';

	export let as: {
		root?: RenderElementTagName;
		button?: RenderElementTagName;
		panel?: RenderElementTagName;
	} = {};

	export let rest: {
		root?: {};
		button?: {};
		panel?: {};
	} = {};

	export let use: {
		root?: Forwarder.Actions;
		button?: Forwarder.Actions;
		panel?: Forwarder.Actions;
	} = {};
</script>

<Disclosure open as={as.root} use={use.root} {...rest.root} data-testid="root">
	Disclosure
	<DisclosureButton as={as.button} use={use.button} {...rest.button} data-testid="button"
		>Button</DisclosureButton
	>
	<DisclosurePanel as={as.panel} use={use.panel} {...rest.panel} data-testid="panel">
		Panel
	</DisclosurePanel>
</Disclosure>
