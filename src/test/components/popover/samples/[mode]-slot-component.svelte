<script>
	import { Popover, PopoverButton, PopoverOverlay, PopoverPanel } from '$lib/components';
</script>

<Popover forceFocus let:close>
	<PopoverOverlay as="slot" let:overlay>
		<div use:overlay data-testid="popover-overlay" />
	</PopoverOverlay>
	<PopoverButton as="slot" let:button>
		<button use:button> Button </button>
	</PopoverButton>
	<PopoverPanel as="slot" let:panel>
		<div use:panel data-testid="popover-panel">
			<button on:click={close}> Close Me </button>
		</div>
	</PopoverPanel>
</Popover>
