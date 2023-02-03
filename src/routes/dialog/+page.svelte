<script lang="ts">
	import { Page } from "@app/layout";
	import { Toggle } from "@app/components";
	import { Dialog, DialogContent, DialogDescription, DialogOverlay, DialogTitle } from "$lib";
	import { fade, scale } from "svelte/transition";

	let open = false;
	let showing = false;
	let initialFocus: HTMLElement;
	let isShowingRef = false;
	let isShowingFocusableChildren = true;

	$: if (isShowingRef) isShowingFocusableChildren = true;
</script>

<Page title="Dialog">
	<div class="flex items-center gap-3" slot="options">
		<Toggle bind:checked={open} />
		<Toggle text="Toggle Motionless" bind:checked={showing} />
		<Toggle text="Toggle Initial Focus Element" bind:checked={isShowingRef} />
		<Toggle text="Toggle Focusable Children" bind:checked={isShowingFocusableChildren} />
	</div>
	<Dialog
		class="fixed inset-0 | grid place-content-center"
		bind:open
		let:overlay
		let:content
		let:close
		{initialFocus}
	>
		<div
			class="fixed inset-0 | bg-black/90 backdrop-filter backdrop-blur-1px"
			use:overlay
			transition:fade
		/>
		<div
			class="w-120 p-8 z-10 | grid gap-6 | bg-neutral-800"
			transition:scale={{ start: 1.1 }}
			use:content
		>
			<div class="grid gap-3">
				<DialogTitle class="font-semibold text-2xl text-white">
					Do you want to delete your account?
				</DialogTitle>
				<DialogDescription>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae eum animi odit ut
					repudiandae cum quae officia molestias. Dolorem, quaerat.
				</DialogDescription>
			</div>
			{#if isShowingFocusableChildren}
				<div class="flex gap-3">
					<button class="button button--small" on:click={close}> Cancel </button>
					<button class="button button--small" on:click={close}> Delete </button>
					{#if isShowingRef}
						<button class="button button--small" on:click={close} id="ref" bind:this={initialFocus}>
							Initial Focus
						</button>
					{/if}
				</div>
			{/if}
		</div>
	</Dialog>
	<Dialog class="fixed inset-0 | grid place-content-center" bind:open={showing} {initialFocus}>
		<DialogOverlay class="fixed inset-0 | bg-black/90 backdrop-filter backdrop-blur-1px" />
		<DialogContent class="w-120 py-8 z-10 | grid gap-6 | bg-neutral-800" let:close>
			<div class="grid gap-3">
				<DialogTitle class="px-8 | font-semibold text-2xl text-white">
					Do you want to delete your account?
				</DialogTitle>
				<div class="w-full h-0.5 | bg-neutral-15" aria-hidden />
				<DialogDescription class="px-8">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae eum animi odit ut
					repudiandae cum quae officia molestias. Dolorem, quaerat.
				</DialogDescription>
			</div>
			{#if isShowingFocusableChildren}
				<div class="px-8 | flex gap-3">
					<button class="button button--small" on:click={close}> Cancel </button>
					<button class="button button--small" on:click={close}> Delete </button>
					{#if isShowingRef}
						<button class="button button--small" on:click={close} bind:this={initialFocus}>
							Initial Focus
						</button>
					{/if}
				</div>
			{/if}
		</DialogContent>
	</Dialog>
</Page>
