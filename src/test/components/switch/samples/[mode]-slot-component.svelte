<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { Switch, SwitchDescription, SwitchLabel } from '$lib/components';
	import { useRange } from '@test-utils';

	export let amount = useRange(3);
	export let checked: Writable<boolean> | boolean | undefined = undefined;
</script>

<Switch as="slot" {checked} let:button>
	{#each $amount as index (index)}
		<SwitchLabel as="slot" let:label>
			<span use:label> Switch Label </span>
		</SwitchLabel>
		<SwitchDescription as="slot" let:description>
			<p use:description>Switch Description</p>
		</SwitchDescription>
	{/each}
	<button use:button data-testid="switch-root" />
</Switch>
