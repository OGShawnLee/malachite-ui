<script lang="ts">
	import { Switch, SwitchGroup, SwitchLabel } from '@components';

	export let passive: boolean | undefined = undefined;
</script>

<SwitchGroup let:label>
	<span use:label={passive}> Action Component Label </span>
	<SwitchLabel {passive}>Component Label</SwitchLabel>
	<Switch>Switch</Switch>
</SwitchGroup>
