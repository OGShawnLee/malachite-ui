<script>
	import { Switch, SwitchDescription, SwitchGroup, SwitchLabel } from '$lib/components';
	import { useRange } from '@test-utils';

	export let amount = useRange(3);
</script>

<SwitchGroup as="div" data-testid="switch-group">
	{#each $amount as index (index)}
		<SwitchLabel>Switch Label</SwitchLabel>
		<SwitchDescription>Switch Description</SwitchDescription>
	{/each}
	<Switch>Switch</Switch>
</SwitchGroup>
