<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { Disclosure } from '@components';

	export let open: Writable<boolean> | boolean | undefined = undefined;
</script>

<Disclosure {open} let:button let:panel>
	<button use:button> Button Element </button>
	<div slot="panel" use:panel>Panel Element</div>
</Disclosure>
