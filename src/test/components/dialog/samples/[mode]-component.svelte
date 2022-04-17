<script lang="ts">
	import type { Readable, Writable } from 'svelte/store';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogOverlay,
		DialogTitle
	} from '@components';
	import { useRange } from '@test-utils';

	export let Titles = useRange(1);
	export let Descriptions = useRange(1);
	export let open: Writable<boolean> | undefined = undefined;
	export let initialFocus: Readable<HTMLElement> | HTMLElement | undefined = undefined;
	export let showInitialFocus = false;

	function toggle() {
		open = !open;
	}
</script>

<button on:click={toggle}> Toggle </button>
<button>External Initial Focus</button>

<Dialog {open} {initialFocus} data-testid="dialog-root">
	<button> Invalid First </button>
	<DialogOverlay data-testid="dialog-overlay">
		<button> Another Invalid First </button>
	</DialogOverlay>
	<DialogContent let:close>
		Dialog Content
		{#each $Titles as index}
			<DialogTitle>
				Title {index}
			</DialogTitle>
		{/each}
		{#each $Descriptions as index}
			<DialogDescription>
				Description {index}
			</DialogDescription>
		{/each}
		<footer>
			<button on:click={close}> Close Me </button>
			{#if showInitialFocus}
				<button bind:this={initialFocus}> Initial Focus </button>
			{/if}
		</footer>
	</DialogContent>
</Dialog>
