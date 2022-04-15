<script lang="ts">
	import type { Readable } from 'svelte/store';
	import { Disclosure, DisclosureButton, DisclosurePanel } from '@components';

	export let disabled: Readable<Nullable<boolean>> | Nullable<boolean> = undefined;
</script>

<Disclosure as="section" {disabled} let:isDisabled open>
	Component
	<span> {isDisabled} </span>
	<DisclosureButton let:isDisabled>
		Component
		<span> {isDisabled} </span>
	</DisclosureButton>
	<DisclosurePanel>
		Component
		<span> {isDisabled} </span>
	</DisclosurePanel>
</Disclosure>
