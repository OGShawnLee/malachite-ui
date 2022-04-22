<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { Disclosure, DisclosureButton, DisclosurePanel } from '$lib/components';

	export let open: Writable<boolean> | boolean | undefined = undefined;
</script>

<Disclosure {open} data-testid="disclosure-root" let:button let:panel let:close>
	<DisclosureButton as="slot" let:button>
		<button use:button> Toggle </button>
	</DisclosureButton>
	<DisclosurePanel as="slot" let:panel let:close>
		<div use:panel data-testid="disclosure-panel">
			<button on:click={close}> Close Panel </button>
		</div>
	</DisclosurePanel>
</Disclosure>
