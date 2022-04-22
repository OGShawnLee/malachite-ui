<script lang="ts">
	import { Switch, SwitchDescription, SwitchLabel } from '$lib/components';
	import { useRange } from '@test-utils';

	export let amount = useRange(3);
</script>

{#each $amount as index (index)}
	<Switch as="slot" let:button let:isChecked>
		{#each $amount as index (index)}
			<SwitchLabel>Switch Label</SwitchLabel>
			<SwitchDescription>Switch Description</SwitchDescription>
		{/each}
		<button use:button> Switch </button>
		<span data-testid="switch-{index}-isChecked-holder">
			{isChecked}
		</span>
	</Switch>
{/each}
