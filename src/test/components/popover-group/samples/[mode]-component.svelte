<script lang="ts">
	import type { Readable } from 'svelte/store';
	import { Popover, PopoverButton, PopoverGroup, PopoverOverlay, PopoverPanel } from '@components';
	import { useRange } from '@test-utils';

	export let expanded: Readable<boolean> | boolean = false;
	const range = useRange(3);
</script>

<button> External </button>

<PopoverGroup data-testid="popover-group" {expanded} let:allClosed let:allOpen let:isOpen>
	<span data-testid="group-allClosed-holder">
		{allClosed}
	</span>
	<span data-testid="group-allOpen-holder">
		{allOpen}
	</span>
	<span data-testid="group-isOpen-holder">
		{isOpen}
	</span>
	{#each $range as index (index)}
		<Popover let:close data-testid="popover-root">
			<PopoverOverlay data-testid="popover-overlay" />
			<PopoverButton>Toggle</PopoverButton>
			<PopoverPanel data-testid="popover-panel">
				<button on:click={close}> Close Me </button>
			</PopoverPanel>
		</Popover>
	{/each}
</PopoverGroup>
