<script>
	import { Popover } from '@components';
</script>

<Popover forceFocus let:button let:overlay let:panel let:close>
	<div slot="overlay" use:overlay data-testid="popover-overlay" />
	<button use:button> Button </button>
	<div slot="panel" use:panel data-testid="popover-panel">
		<button on:click={close}> Close Me </button>
	</div>
</Popover>
