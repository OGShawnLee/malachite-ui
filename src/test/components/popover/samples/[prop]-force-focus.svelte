<script lang="ts">
	import type { Readable } from 'svelte/store';
	import { Popover, PopoverButton, PopoverOverlay, PopoverPanel } from '@components';

	export let forceFocus: Readable<boolean> | boolean = true;
</script>

<Popover {forceFocus} data-testid="popover-root">
	<PopoverOverlay data-testid="popover-overlay">
		<button>Overlay Button</button>
	</PopoverOverlay>
	<PopoverButton>Button</PopoverButton>
	<PopoverPanel data-testid="popover-panel" let:close>
		<div>
			<button disabled> Invalid Button </button>
			<button on:click={close}> Close Me </button>
		</div>
	</PopoverPanel>
</Popover>

<button> External </button>
