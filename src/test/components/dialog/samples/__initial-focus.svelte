<script lang="ts">
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogOverlay,
		DialogTitle
	} from '$lib/components';

	let initialFocus: HTMLElement;
	export let initialFocusTarget: 'EXTERNAL' | 'DIALOG' | 'OVERLAY' | 'VALID' | null = null;

	let open = false;
	function toggle() {
		open = !open;
	}
</script>

<button on:click={toggle}> Toggle </button>

{#if initialFocusTarget === 'EXTERNAL'}
	<button bind:this={initialFocus}> Invalid Initial Focus External</button>
{/if}

<Dialog {open} {initialFocus} data-testid="dialog-initial-focus-root">
	{#if initialFocusTarget === 'DIALOG'}
		<button bind:this={initialFocus}> Invalid Initial Focus Dialog </button>
	{/if}
	<DialogOverlay>
		{#if initialFocusTarget === 'OVERLAY'}
			<button bind:this={initialFocus}> Invalid Initial Focus Overlay </button>
		{/if}
	</DialogOverlay>
	<DialogContent let:close>
		<DialogTitle>Title</DialogTitle>
		<DialogDescription>Description</DialogDescription>
		<footer>
			<button disabled>Not Focusable</button>
			<button on:click={close}> Close </button>
			{#if initialFocusTarget === 'VALID'}
				<button bind:this={initialFocus}> Initial Focus </button>
			{/if}
		</footer>
	</DialogContent>
</Dialog>
