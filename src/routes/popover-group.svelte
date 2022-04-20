<script>
	import { Popover, PopoverButton, PopoverGroup, PopoverPanel } from '@components';
	import { useRange, useToggle } from '@test-utils';
	import { fade, fly, scale, slide } from 'svelte/transition';

	const range = useRange(4);

	let [expanded, toggleExpanded] = useToggle(true);
	let [expanded2, toggleExpanded2] = useToggle(true);
</script>

<main class="container mx-auto my-8 | flex flex-col gap-12">
	<!-- FOCUSING WILL CLOSE THE GROUP -->
	<button class="max-w-[fit-content] px-8 py-2 | font-medium" on:click={toggleExpanded}>
		Expanded {$expanded}
	</button>

	<PopoverGroup as="section" class="flex flex-col gap-4" {expanded} let:allOpen>
		<h2 class="pl-8 | text-xl font-medium">Component Popover Group {allOpen}</h2>
		<div class="grid grid-cols-4 gap-4">
			{#each $range as index}
				<Popover class="flex flex-col gap-3">
					<PopoverButton class="max-w-[fit-content] | px-8 py-2 font-medium">
						Toggle {index}
					</PopoverButton>
					<PopoverPanel class="grid gap-3" let:close>
						<p class="leading-relaxed">
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates ipsum rem
							molestiae provident quibusdam blanditiis deserunt consectetur debitis repellendus
							corporis!
						</p>
						<button class="px-6 py-2 font-medium" on:click={close}> Close Me </button>
					</PopoverPanel>
				</Popover>
			{/each}
		</div>
	</PopoverGroup>

	<PopoverGroup as="section" class="flex flex-col" {expanded} let:allClosed>
		<h2 class="pl-8 | text-xl font-medium">Action Component Group {allClosed}</h2>

		<button class="max-w-[fit-content] px-8 py-2 | font-medium" on:click={toggleExpanded}>
			Expanded {$expanded}
		</button>

		<div class="grid grid-cols-4 gap-4">
			<Popover class="flex flex-col gap-3" let:panel let:close>
				<PopoverButton class="max-w-[fit-content] | px-8 py-2 font-medium">Toggle</PopoverButton>
				<div slot="panel" class="leading-relaxed" use:panel transition:fade|local>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates ipsum rem molestiae
						provident quibusdam blanditiis deserunt consectetur debitis repellendus corporis!
					</p>
					<div class="flex gap-6">
						<button class="px-6 py-2 font-medium" on:click={close}> Close Me </button>
						<a href="/" class="block px-6 py-2">Home</a>
					</div>
				</div>
			</Popover>
			<Popover forceFocus class="flex flex-col gap-3" let:panel let:close>
				<PopoverButton class="max-w-[fit-content] | px-8 py-2 font-medium">Toggle</PopoverButton>
				<div slot="panel" class="leading-relaxed" use:panel transition:slide|local>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates ipsum rem molestiae
						provident quibusdam blanditiis deserunt consectetur debitis repellendus corporis!
					</p>
					<div class="flex gap-6">
						<button class="px-6 py-2 font-medium" on:click={close}> Close Me </button>
						<a href="/" class="block px-6 py-2">Home</a>
					</div>
				</div>
			</Popover>
			<Popover forceFocus class="flex flex-col gap-3" let:panel let:close>
				<PopoverButton class="max-w-[fit-content] | px-8 py-2 font-medium">Toggle</PopoverButton>
				<div slot="panel" class="leading-relaxed" use:panel transition:fly|local={{ y: 60 }}>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates ipsum rem molestiae
						provident quibusdam blanditiis deserunt consectetur debitis repellendus corporis!
					</p>
					<div class="flex gap-6">
						<button class="px-6 py-2 font-medium" on:click={close}> Close Me </button>
						<a href="/" class="block px-6 py-2">Home</a>
					</div>
				</div>
			</Popover>
			<Popover class="flex flex-col gap-3" let:panel let:close>
				<PopoverButton class="max-w-[fit-content] | px-8 py-2 font-medium">Toggle</PopoverButton>
				<div
					slot="panel"
					class="leading-relaxed"
					use:panel
					transition:scale|local={{ start: 0.75 }}
				>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates ipsum rem molestiae
						provident quibusdam blanditiis deserunt consectetur debitis repellendus corporis!
					</p>
					<div class="flex gap-6">
						<button class="px-6 py-2 font-medium" on:click={close}> Close Me </button>
						<a href="/" class="block px-6 py-2">Home</a>
					</div>
				</div>
			</Popover>
		</div>
	</PopoverGroup>

	<PopoverGroup as="section" class="flex flex-col gap-4" expanded>
		<h2 class="pl-8 | text-xl font-medium">Expanded Group with ForceFocus and Group Overlay</h2>
		<!-- OVERLAY APPLIES TO ALL THE POPOVERS -->
		<div slot="overlay" class="fixed inset-0 bg-black/85" transition:fade|local />
		<div class="grid grid-cols-4 gap-4">
			{#each $range as index}
				<Popover forceFocus class="flex flex-col gap-3" let:panel let:close>
					<PopoverButton class="max-w-[fit-content] | px-8 py-2 font-medium">
						Toggle {index}
					</PopoverButton>
					<div
						slot="panel"
						class="fixed bottom-1/2 right-1/2 transform translate-x-1/2 translate-y-1/2 p-8 | bg-white rounded-md"
						use:panel
						transition:slide|local
					>
						<div class="space-y-3">
							<p class="leading-relaxed">
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates ipsum rem
								molestiae provident quibusdam blanditiis deserunt consectetur debitis repellendus
								corporis!
							</p>
							<div class="flex gap-6">
								<button class="px-6 py-2 font-medium" on:click={close}> Close Me </button>
								<a href="/" class="block px-6 py-2">Home</a>
							</div>
						</div>
					</div>
				</Popover>
			{/each}
		</div>
	</PopoverGroup>

	<PopoverGroup as="section" class="flex flex-col gap-4" expanded={expanded2}>
		<h2 class="pl-8 | text-xl font-medium">Popover Overlay vs Group Overlay</h2>

		<p class="pl-8">Popover Overlay is not rendered when expanded. Use Group Overlay instead.</p>

		<button class="max-w-[fit-content] px-8 py-2 | font-medium" on:click={toggleExpanded2}>
			Expanded {$expanded2}
		</button>

		<div class="grid grid-cols-4 gap-4">
			{#each $range as index}
				<Popover class="flex flex-col gap-3" let:panel let:close let:overlay>
					<!-- LOCAL OVERLAY CANNOT BE USED WHEN EXPANDED -> USE GROUP OVERLAY -->
					<div slot="overlay" class="fixed inset-0 bg-black/85" use:overlay transition:fade|local />
					<PopoverButton class="max-w-[fit-content] | px-8 py-2 font-medium">
						Toggle {index}
					</PopoverButton>
					<div
						slot="panel"
						class="fixed bottom-1/2 right-1/2 transform translate-x-1/2 translate-y-1/2 p-8 | bg-white rounded-md"
						use:panel
						transition:slide|local
					>
						<div class="space-y-3">
							<p class="leading-relaxed">
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates ipsum rem
								molestiae provident quibusdam blanditiis deserunt consectetur debitis repellendus
								corporis!
							</p>
							<div class="flex gap-6">
								<button class="px-6 py-2 font-medium" on:click={close}> Close Me </button>
								<a href="/" class="block px-6 py-2">Home</a>
							</div>
						</div>
					</div>
				</Popover>
			{/each}
		</div>
	</PopoverGroup>
</main>

<style>
	button:focus {
		@apply ring-2 ring-black;
	}
</style>
