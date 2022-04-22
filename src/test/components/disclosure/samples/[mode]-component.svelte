<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { Disclosure, DisclosureButton, DisclosurePanel } from '@components';

	export let open: Writable<boolean> | boolean | undefined = undefined;
	export let showPanel = true;
</script>

<Disclosure {open} data-testid="disclosure-root" let:isOpen let:close>
	<span data-testid="disclosure-isOpen-holder">
		{isOpen}
	</span>
	<button on:click={close}> Close Disclosure </button>
	<DisclosureButton let:isOpen>
		Toggle
		<span data-testid="button-isOpen-holder">
			{isOpen}
		</span>
	</DisclosureButton>
	{#if showPanel}
		<DisclosurePanel data-testid="disclosure-panel" let:close>
			<button on:click={close}> Close Panel </button>
		</DisclosurePanel>
	{/if}
</Disclosure>
