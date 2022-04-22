<script>
	import { Disclosure, DisclosureButton, DisclosurePanel } from '$lib/components';
	import { generateActions } from '@test-utils';
</script>

<Disclosure>
	<DisclosureButton use={generateActions(3)}>Toggle</DisclosureButton>
	<DisclosurePanel use={generateActions(3)} data-testid="disclosure-panel">
		Disclosure panel
	</DisclosurePanel>
</Disclosure>
