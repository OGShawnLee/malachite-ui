<script lang="ts">
	import type { Forwarder } from '$lib/types';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogOverlay,
		DialogTitle
	} from '$lib/components';

	interface ComponentConfig {
		as?: RenderElementTagName;
		use: Forwarder.Actions;
	}

	export let dialog: ComponentConfig = { use: [] };
	export let content: ComponentConfig = { use: [] };
	export let overlay: ComponentConfig = { use: [] };
	export let title: ComponentConfig = { use: [] };
	export let description: ComponentConfig = { use: [] };

	let open = false;
</script>

<button on:click={() => (open = !open)}> Toggle </button>

<Dialog bind:open as={dialog.as} use={dialog.use} data-testid="dialog--root">
	<DialogOverlay as={overlay.as} use={overlay.use}>Overlay</DialogOverlay>
	<DialogContent as={content.as} use={content.use}>
		Content
		<DialogTitle as={title.as} use={title.use}>Title</DialogTitle>
		<DialogDescription as={description.as} use={description.use}>Description</DialogDescription>
	</DialogContent>
</Dialog>
