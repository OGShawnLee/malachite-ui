<script lang="ts">
	import type { Forwarder, RenderElementTagName } from '$lib/types';
	import { Disclosure, DisclosureButton, DisclosurePanel } from '$lib/components';

	interface ComponentConfig {
		as?: RenderElementTagName;
		use?: Forwarder.Actions;
		rest?: {};
	}

	export let button: ComponentConfig = {};
	export let panel: ComponentConfig = {};
</script>

<Disclosure open>
	<DisclosureButton
		data-testid="disclosure-button"
		as={button?.as}
		use={button?.use}
		{...button.rest}
	>
		Toggle
	</DisclosureButton>
	<DisclosurePanel data-testid="disclosure-panel" as={panel?.as} use={panel?.use} {...panel.rest} />
</Disclosure>
