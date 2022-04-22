<script>
	import { Switch, SwitchGroup, SwitchLabel } from '$lib/components';
	import { useRange } from '@test-utils';

	export let labels = useRange(3);
</script>

<SwitchGroup>
	{#each $labels as index (index)}
		<SwitchLabel>Switch Label</SwitchLabel>
	{/each}
	<Switch data-testid="switch-root" />
</SwitchGroup>
