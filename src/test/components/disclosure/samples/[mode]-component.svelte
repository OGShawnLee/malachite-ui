<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { Disclosure, DisclosureButton, DisclosurePanel } from '@components';

	export let open: Writable<boolean> | boolean | undefined = undefined;
	export let panelTestId = 'panel';
	export let showing = true;
</script>

<Disclosure bind:open>
	<DisclosureButton>Button Element</DisclosureButton>
	{#if showing}
		<DisclosurePanel data-testid={panelTestId}>Panel Element</DisclosurePanel>
	{/if}
</Disclosure>
