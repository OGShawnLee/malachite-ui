<script>
	import { Popover, PopoverButton, PopoverOverlay, PopoverPanel } from '$lib/components';
	import { fade, slide, scale } from 'svelte/transition';
	import { sineOut } from 'svelte/easing';
</script>

<!-- Action Component -->
<!-- WE HAVE FULL CONTROL OVER TRANSITIONS -->
<Popover class="grid gap-3" let:button let:panel let:close>
	<button class="px-6 py-2 | font-medium" use:button> Toggle </button>
	<div slot="panel" class="max-w-sm p-8 | grid gap-3" use:panel transition:slide|local>
		<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos delectus illo ipsum.</p>
		<div class="flex gap-3">
			<button class="px-8 py-2 font-medium" on:click={close}> Close Me </button>
			<a class="block px-8 py-2 font-medium" href="/"> Home </a>
		</div>
	</div>
</Popover>

<!-- With Overlay -->
<Popover as="slot" forceFocus let:button let:panel let:overlay let:close let:isOpen>
	<div slot="overlay" class="fixed inset-0 bg-black/50" use:overlay transition:fade|local />
	<button class="px-6 py-2 | font-medium" use:button>
		Toggle {isOpen}
	</button>
	<div
		slot="panel"
		class="max-w-sm fixed over-center p-8 | grid gap-3 | bg-white"
		use:panel
		transition:scale|local={{ start: 1.5, easing: sineOut }}
	>
		<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos delectus illo ipsum.</p>
		<div class="flex gap-3">
			<button class="px-8 py-2 font-medium" on:click={close}> Close Me </button>
			<a class="block px-8 py-2 font-medium" href="/"> Home </a>
		</div>
	</div>
</Popover>

<!-- Component -->
<Popover as="slot" forceFocus let:close>
	<PopoverOverlay class="fixed inset-0 bg-black/90" />
	<PopoverButton class="px-6 py-2 font-medium">Toggle</PopoverButton>
	<PopoverPanel class="max-w-sm fixed over-center p-8 | grid gap-3 | bg-white">
		<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos delectus illo ipsum.</p>
		<div class="flex gap-3">
			<button class="px-8 py-2 font-medium" on:click={close}> Close Me </button>
			<a class="block px-8 py-2 font-medium" href="/"> Home </a>
		</div>
	</PopoverPanel>
</Popover>

<!-- Slot Component -->
<Popover as="slot" forceFocus let:close>
	<PopoverOverlay as="slot" let:overlay>
		<div class="fixed inset-0 bg-black/90" use:overlay />
	</PopoverOverlay>
	<PopoverButton as="slot" let:button>
		<button class="px-6 py-2 font-medium" use:button> Toggle </button>
	</PopoverButton>
	<PopoverPanel as="slot" let:panel>
		<div class="max-w-sm fixed over-center p-8 | grid gap-3 | bg-white" use:panel>
			<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos delectus illo ipsum.</p>
			<div class="flex gap-3">
				<button class="px-8 py-2 font-medium" on:click={close}> Close Me </button>
				<a class="block px-8 py-2 font-medium" href="/"> Home </a>
			</div>
		</div>
	</PopoverPanel>
</Popover>

<style>
	:global(.over-center) {
		@apply top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2;
	}
</style>
