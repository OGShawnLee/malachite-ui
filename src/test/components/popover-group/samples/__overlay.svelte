<script lang="ts">
	import type { Readable } from 'svelte/store';
	import { Popover, PopoverButton, PopoverGroup, PopoverOverlay, PopoverPanel } from '@components';
	import { useRange } from '@test-utils';

	export let expanded: Readable<boolean> | boolean = false;

	const range = useRange(3);
</script>

<button> External </button>

<PopoverGroup {expanded}>
	<PopoverOverlay>Group Overlay</PopoverOverlay>
	{#each $range as index (index)}
		<Popover>
			<PopoverOverlay>Popover Overlay</PopoverOverlay>
			<PopoverButton>Toggle</PopoverButton>
			<PopoverPanel let:close>
				Popover Panel
				<button on:click={close}> Close Me </button>
			</PopoverPanel>
		</Popover>
	{/each}
</PopoverGroup>
