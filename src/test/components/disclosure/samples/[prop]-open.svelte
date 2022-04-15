<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { Disclosure, DisclosureButton, DisclosurePanel } from '@components';

	export let open: Writable<boolean> | boolean | undefined = undefined;
</script>

<Disclosure {open} let:isOpen>
	<span> {isOpen} </span>
	<DisclosureButton let:isOpen>
		<span> {isOpen} </span>
		Button
	</DisclosureButton>
	<DisclosurePanel>Panel</DisclosurePanel>
</Disclosure>
