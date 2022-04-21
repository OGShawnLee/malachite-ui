<script lang="ts">
	import { Switch } from '@components';
	import type { Writable } from 'svelte/store';

	export let checked: Writable<boolean> | boolean | undefined = undefined;
</script>

<Switch {checked} let:isChecked data-testid="switch-root">
	<span> Toggle Color Mode </span>
	<span aria-hidden="true" data-testid="switch-isChecked-holder">
		{isChecked}
	</span>
</Switch>
