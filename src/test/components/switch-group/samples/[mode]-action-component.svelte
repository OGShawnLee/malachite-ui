<script>
	import { Switch, SwitchGroup } from '$lib/components';
	import { useRange } from '@test-utils';

	export let amount = useRange(3);
</script>

<SwitchGroup as="div" data-testid="switch-group" let:description let:label>
	{#each $amount as index (index)}
		<span use:label>Switch Label</span>
		<p use:description>Switch Description</p>
	{/each}
	<Switch>Switch</Switch>
</SwitchGroup>
