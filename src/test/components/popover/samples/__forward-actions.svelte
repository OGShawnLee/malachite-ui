<script lang="ts">
	import { Popover, PopoverButton, PopoverOverlay, PopoverPanel } from '$lib/components';
	import { generateActions } from '@test-utils';

	export let showPanel = true;
</script>

<Popover forceFocus use={generateActions(3)}>
	<PopoverOverlay data-testid="popover-overlay" />
	<PopoverButton use={generateActions(3)}>Button</PopoverButton>
	{#if showPanel}
		<PopoverPanel data-testid="popover-panel" let:close use={generateActions(3)}>
			<button on:click={close}> Close Me </button>
		</PopoverPanel>
	{/if}
</Popover>
