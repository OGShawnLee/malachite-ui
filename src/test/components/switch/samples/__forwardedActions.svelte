<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { Switch, SwitchDescription, SwitchGroup, SwitchLabel } from '$lib/components';
	import { generateActions, useRange } from '@test-utils';

	export let amount = useRange(3);
	export let checked: Writable<boolean> | boolean | undefined = undefined;
</script>

<SwitchGroup>
	{#each $amount as index (index)}
		<SwitchLabel use={generateActions(3)}>Switch Label</SwitchLabel>
		<SwitchDescription use={generateActions(3)}>Switch Description</SwitchDescription>
	{/each}
	<Switch {checked} use={generateActions(3)} data-testid="switch-root" />
</SwitchGroup>
