<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { Disclosure, DisclosureButton } from '@components';

	export let open: Writable<boolean> | boolean = false;
</script>

<Disclosure {open}>
	<div slot="up-panel" let:panel use:panel>Up Panel</div>
	<DisclosureButton>Button Element</DisclosureButton>
</Disclosure>