<script>
	import { Switch, SwitchDescription, SwitchGroup } from '$lib/components';
	import { useRange } from '@test-utils';

	export let descriptions = useRange(3);
</script>

<SwitchGroup>
	{#each $descriptions as index (index)}
		<SwitchDescription>Switch Description</SwitchDescription>
	{/each}
	<Switch data-testid="switch-root" />
</SwitchGroup>
