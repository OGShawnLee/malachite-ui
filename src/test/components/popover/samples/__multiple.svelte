<script>
	import { Popover, PopoverButton, PopoverOverlay, PopoverPanel } from '$lib/components';
</script>

<Popover>
	Popover
	<PopoverOverlay>Overlay</PopoverOverlay>
	<PopoverButton>Button</PopoverButton>
	<PopoverPanel>Panel</PopoverPanel>
</Popover>

<Popover let:button let:overlay let:panel>
	Popover
	<div slot="overlay" use:overlay>Overlay</div>
	<button use:button>Button</button>
	<div slot="panel" use:panel>Panel</div>
</Popover>

<Popover let:button let:overlay let:panel>
	Popover
	<PopoverOverlay as="slot">
		<div use:overlay>Overlay</div>
	</PopoverOverlay>
	<PopoverButton as="slot">
		<button use:button>Button</button>
	</PopoverButton>
	<PopoverPanel as="slot">
		<div use:panel>Panel</div>
	</PopoverPanel>
</Popover>
