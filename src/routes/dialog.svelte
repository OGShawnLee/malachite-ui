<script lang="ts">
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogOverlay,
		DialogTitle
	} from '$lib/components';
	import { useToggle } from '@test-utils';
	import { fade, scale } from 'svelte/transition';

	let [open, toggle] = useToggle();
	let initialFocus: HTMLElement;

	let [another, toggleAnother] = useToggle();
</script>

<button on:click={toggle}>
	Toggle {$open}
</button>

<button on:click={toggleAnother}>
	Toggle Another {$another}
</button>

<button> External </button>

<Dialog class="fixed inset-0 | flex items-center justify-center" {open} {initialFocus}>
	<DialogOverlay class="fixed inset-0 | bg-black/90" />
	<DialogContent class="max-w-md p-10 z-10 | bg-white" let:close>
		<DialogTitle class="mb-2 | text-2xl font-bold">
			Lorem ipsum dolor sit amet consectetur.
		</DialogTitle>
		<DialogDescription class="leading-relaxed">
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio ad reprehenderit quod
			laudantium beatae. Iure provident voluptates nostrum eius? Voluptates exercitationem totam
			deserunt nam.
		</DialogDescription>
		<DialogDescription class="leading-relaxed">
			Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corporis doloribus eligendi aperiam!
		</DialogDescription>
		<div class="flex gap-4 mt-4">
			<button class="px-6 py-2 font-medium">Accept</button>
			<button bind:this={initialFocus} class="px-6 py-2 font-medium" on:click={close}>Close</button>
		</div>
	</DialogContent>
</Dialog>

<!-- SEEMS LIKE WE CAN ONLY USE TRANSITIONS IF WE ARE NOT GOING TO ANOTHER PAGE  -->
<Dialog as="slot" let:dialog let:overlay let:content let:close open={another}>
	<div class="fixed inset-0 | flex items-center justify-center" use:dialog>
		<div class="fixed inset-0 | bg-black/90" use:overlay transition:fade />
		<div class="max-w-md p-10 z-10 | bg-white" use:content transition:scale={{ start: 1.25 }}>
			<DialogTitle class="mb-2 | text-2xl font-bold">
				Lorem ipsum dolor sit amet consectetur.
			</DialogTitle>
			<DialogDescription class="leading-relaxed">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio ad reprehenderit quod
				laudantium beatae. Iure provident voluptates nostrum eius? Voluptates exercitationem totam
				deserunt nam.
			</DialogDescription>
			<div class="flex gap-4 mt-4">
				<button class="px-6 py-2 font-medium" on:click={close}>Close</button>
				<a class="block px-6 py-2 font-medium" href="/">Home</a>
			</div>
		</div>
	</div>
</Dialog>
