<script lang="ts">
	import { Popover, PopoverButton, PopoverOverlay, PopoverPanel } from '$lib/components';

	export let showPanel = true;
</script>

<Popover data-testid="popover-root" let:close let:isOpen>
	<PopoverOverlay data-testid="popover-overlay" />
	<PopoverButton let:isOpen>
		Button
		<span data-testid="button-isOpen-holder">
			{isOpen}
		</span>
	</PopoverButton>

	<span data-testid="global-isOpen-holder">
		{isOpen}
	</span>

	<button on:click={close}> Global Close </button>

	{#if showPanel}
		<PopoverPanel data-testid="popover-panel" let:close>
			<button on:click={close}> Close Me </button>
		</PopoverPanel>
	{/if}
</Popover>
