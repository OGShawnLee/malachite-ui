<script lang="ts">
	import { Page } from "@app/layout";
	import { Toggle } from "@app/components";
	import { RadioGroup, RadioGroupDescription, RadioGroupLabel, RadioGroupOption } from "$lib";
	import { useClassNameResolver } from "$lib/hooks";

	let horizontal = false;
	let value = "Halo 2";

	const className = useClassNameResolver<"DISABLED" | "SELECTED">({
		base: "px-6 py-2 | flex items-center justify-between | outline-none focus:(ring-2 ring-white)",
		disabled: { on: "bg-neutral-800 opacity-50", off: "cursor-pointer" },
		selected: { on: "bg-neutral-700 font-medium text-white", off: "bg-neutral-800" }
	});
</script>

<Page title="Radio Group">
	<svelte:fragment slot="options">
		<Toggle bind:checked={horizontal} text="Toggle Horizontal" />
	</svelte:fragment>
	<div class="grid grid-cols-4 items-start gap-6">
		<RadioGroup class="grid gap-3" bind:value {horizontal}>
			<RadioGroupLabel class="text-white">Best trilogy Bungie Halo game</RadioGroupLabel>
			<RadioGroupOption class={className} value="Halo CE" let:isSelected>
				<RadioGroupLabel>Halo Combat Evolved</RadioGroupLabel>
				{#if isSelected}
					<div class="w-5 h-5 | grid place-content-center">
						<i class="bx bxs-badge-check text-xl" />
					</div>
				{/if}
			</RadioGroupOption>
			<RadioGroupOption class={className} value="Halo 2" let:isSelected>
				<RadioGroupLabel>Halo 2</RadioGroupLabel>
				{#if isSelected}
					<div class="w-5 h-5 | grid place-content-center">
						<i class="bx bxs-badge-check text-xl" />
					</div>
				{/if}
			</RadioGroupOption>
			<RadioGroupOption class={className} value="Halo 3" let:isSelected>
				<RadioGroupLabel>Halo 3</RadioGroupLabel>
				{#if isSelected}
					<div class="w-5 h-5 | grid place-content-center">
						<i class="bx bxs-badge-check text-xl" />
					</div>
				{/if}
			</RadioGroupOption>
		</RadioGroup>
		<RadioGroup class="grid gap-3" bind:value {horizontal}>
			<RadioGroupLabel class="text-white">Best major Halo game</RadioGroupLabel>
			<RadioGroupOption class={className} value="Halo Reach" disabled let:isSelected>
				<RadioGroupLabel>Halo Reach</RadioGroupLabel>
				<RadioGroupDescription class="sr-only">
					5th videogame in the Halo series released in 2010.
				</RadioGroupDescription>
				{#if isSelected}
					<div class="w-5 h-5 | grid place-content-center">
						<i class="bx bxs-badge-check text-xl" />
					</div>
				{/if}
			</RadioGroupOption>
			<RadioGroupOption class={className} value="Halo CE" let:isSelected>
				<RadioGroupLabel>Halo Combat Evolved</RadioGroupLabel>
				{#if isSelected}
					<div class="w-5 h-5 | grid place-content-center">
						<i class="bx bxs-badge-check text-xl" />
					</div>
				{/if}
			</RadioGroupOption>
			<RadioGroupOption class={className} value="Halo 2" let:isSelected>
				<RadioGroupLabel>Halo 2</RadioGroupLabel>
				{#if isSelected}
					<div class="w-5 h-5 | grid place-content-center">
						<i class="bx bxs-badge-check text-xl" />
					</div>
				{/if}
			</RadioGroupOption>
			<RadioGroupOption class={className} value="Halo 3" let:isSelected>
				<RadioGroupLabel>Halo 3</RadioGroupLabel>
				{#if isSelected}
					<div class="w-5 h-5 | grid place-content-center">
						<i class="bx bxs-badge-check text-xl" />
					</div>
				{/if}
			</RadioGroupOption>
			<RadioGroupOption class={className} value="Halo 4" disabled let:isSelected>
				<RadioGroupLabel>Halo 4</RadioGroupLabel>
				{#if isSelected}
					<div class="w-5 h-5 | grid place-content-center">
						<i class="bx bxs-badge-check text-xl" />
					</div>
				{/if}
			</RadioGroupOption>
		</RadioGroup>
		<RadioGroup class="grid gap-3" {horizontal}>
			<RadioGroupOption class={className} value="Halo CE" let:isSelected>
				<RadioGroupLabel>Halo Combat Evolved</RadioGroupLabel>
				{#if isSelected}
					<div class="w-5 h-5 | grid place-content-center">
						<i class="bx bxs-badge-check text-xl" />
					</div>
				{/if}
			</RadioGroupOption>
			<RadioGroupOption class={className} value="Halo 2" let:isSelected>
				<RadioGroupLabel>Halo 2</RadioGroupLabel>
				{#if isSelected}
					<div class="w-5 h-5 | grid place-content-center">
						<i class="bx bxs-badge-check text-xl" />
					</div>
				{/if}
			</RadioGroupOption>
			<RadioGroupOption class={className} value="Halo 3" selected let:isSelected>
				<RadioGroupLabel>Halo 3</RadioGroupLabel>
				{#if isSelected}
					<div class="w-5 h-5 | grid place-content-center">
						<i class="bx bxs-badge-check text-xl" />
					</div>
				{/if}
			</RadioGroupOption>
		</RadioGroup>
		<RadioGroup class="grid gap-3" {horizontal}>
			<RadioGroupOption class={className} value="Halo CE" let:isSelected>
				<RadioGroupLabel>Halo Combat Evolved</RadioGroupLabel>
				{#if isSelected}
					<div class="w-5 h-5 | grid place-content-center">
						<i class="bx bxs-badge-check text-xl" />
					</div>
				{/if}
			</RadioGroupOption>
			<RadioGroupOption class={className} value="Halo 2" let:isSelected>
				<RadioGroupLabel>Halo 2</RadioGroupLabel>
				{#if isSelected}
					<div class="w-5 h-5 | grid place-content-center">
						<i class="bx bxs-badge-check text-xl" />
					</div>
				{/if}
			</RadioGroupOption>
			<RadioGroupOption class={className} value="Halo 3" let:isSelected>
				<RadioGroupLabel>Halo 3</RadioGroupLabel>
				{#if isSelected}
					<div class="w-5 h-5 | grid place-content-center">
						<i class="bx bxs-badge-check text-xl" />
					</div>
				{/if}
			</RadioGroupOption>
		</RadioGroup>
	</div>
</Page>
