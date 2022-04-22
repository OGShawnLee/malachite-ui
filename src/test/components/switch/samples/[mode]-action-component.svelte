<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { Switch } from '$lib/components';
	import { useRange } from '@test-utils';

	export let amount = useRange(3);
	export let checked: Writable<boolean> | boolean | undefined = undefined;
</script>

<Switch as="slot" {checked} let:button let:description let:label>
	{#each $amount as index (index)}
		<span use:label> Switch Label </span>
		<p use:description>Switch Description</p>
	{/each}
	<button use:button data-testid="switch-root" />
</Switch>
