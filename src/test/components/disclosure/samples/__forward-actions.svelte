<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { Disclosure, DisclosureButton, DisclosurePanel } from '@components';
	import { generateActions } from '@test-utils';

	export let open: Writable<boolean> | boolean | undefined = undefined;
</script>

<Disclosure bind:open>
	<DisclosureButton use={generateActions(3)}>Button</DisclosureButton>
	<DisclosurePanel use={generateActions(3)}>Panel</DisclosurePanel>
</Disclosure>
