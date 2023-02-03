<script lang="ts">
	import { Page } from "@app/layout";
	import { Toggle } from "@app/components";
	import { Navigable, NavigableItem } from "$lib";
	import { useClassNameResolver } from "$lib/hooks";

	const className = useClassNameResolver<"DISABLED">({
    base: "button button--medium", 
    disabled: "opacity-50"
	});

	let disabled = false;
	let global = false;
	let vertical = false;
	let finite = false;
</script>

<Page title="Navigable">
	<svelte:fragment slot="options">
		<Toggle text="Toggle Finite" bind:checked={finite} />
		<Toggle text="Toggle Global" bind:checked={global} />
		<Toggle text="Toggle Vertical" bind:checked={vertical} />
		<Toggle text="Toggle Disabled Item" bind:checked={disabled} />
	</svelte:fragment>
	<div class="grid gap-12">
		<Navigable class="flex justify-between" {finite} {vertical}>
			<NavigableItem class={className}>First Item</NavigableItem>
			<NavigableItem class={className}>Second Item</NavigableItem>
			<NavigableItem class={className} {disabled}>Third Item</NavigableItem>
			<NavigableItem class={className}>Fourth Item</NavigableItem>
			<NavigableItem class={className}>Fifth Item</NavigableItem>
		</Navigable>
		<Navigable class="flex justify-between" {finite} {global} {vertical}>
			<NavigableItem class="button button--medium opacity-50" disabled>First Item</NavigableItem>
			<NavigableItem class={className}>Second Item</NavigableItem>
			<NavigableItem class="button button--medium opacity-50" disabled>Third Item</NavigableItem>
			<NavigableItem class={className}>Fourth Item</NavigableItem>
			<NavigableItem class="button button--medium opacity-50" disabled>Fifth Item</NavigableItem>
		</Navigable>
	</div>
</Page>
