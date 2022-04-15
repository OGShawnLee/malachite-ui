<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { Disclosure, DisclosureButton, DisclosurePanel } from '@components';

	export let open: Writable<boolean> | boolean | undefined = undefined;
</script>

<Disclosure {open}>
	<DisclosureButton as="slot" let:button>
		<button use:button> Button Element </button>
	</DisclosureButton>
	<DisclosurePanel as="slot" let:panel>
		<div use:panel>Panel Element</div>
	</DisclosurePanel>
</Disclosure>
