<script lang="ts">
	import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "$lib/components";
	import { useClassNameResolver } from "$lib/hooks";
	import { Page } from "@app/layout";
	import { Toggle } from "@app/components";

	const className = useClassNameResolver<"DISABLED" | "SELECTED">({
		base: "px-8 py-2 m-0 | border-b-3 border-transparent outline-none",
		disabled: { off: "hover:text-white", on: "opacity-50" },
		selected: {
			off: "focus-visible:border-b-white",
			on: "bg-neutral-800 text-white focus:(bg-neutral-700)"
		}
	});
	const panelClassName = "p-8 bg-neutral-800 rounded-tl-none outline-none focus:(bg-neutral-700 text-white)";

	let disabled = false;
	let manual = false;
	let vertical = false;
	let finite = false;
</script>

<Page title="Tabs">
	<svelte:fragment slot="options">
		<Toggle text="Toggle Finite" bind:checked={finite} />
		<Toggle text="Toggle Manual" bind:checked={manual} />
		<Toggle text="Toggle Vertical" bind:checked={vertical} />
		<Toggle text="Toggle Disabled Item" bind:checked={disabled} />
	</svelte:fragment>
	<div class="grid gap-12">
		<TabGroup {finite} {manual} {vertical}>
			<TabList>
				<Tab class={className}>Lorem, ipsum dolor.</Tab>
				<Tab class={className} disabled>Lorem, ipsum.</Tab>
				<Tab class={className}>Lorem ipsum dolor sit.</Tab>
				<Tab class={className} disabled>Lorem, ipsum dolor.</Tab>
				<Tab class={className}>Lorem, ipsum.</Tab>
			</TabList>
			<TabPanels>
				<TabPanel class={panelClassName}>
					Lorem ipsum dolor sit, amet consectetur adipisicing elit. Distinctio, optio explicabo
					officia ullam maxime vero eaque corporis, reiciendis quam quos, modi in dicta deserunt
					similique nisi blanditiis eveniet sequi hic!
				</TabPanel>
				<TabPanel class={panelClassName}>Disabled Tab</TabPanel>
				<TabPanel class={panelClassName}>
					Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum cupiditate dolores dicta
					porro eius, iste error quibusdam autem reprehenderit in doloribus commodi obcaecati sint,
					sunt ullam atque provident totam optio dolorum! Officia ipsa placeat voluptatem iure enim,
					libero voluptatibus temporibus aliquam, consectetur, repudiandae qui quo!
				</TabPanel>
				<TabPanel class={panelClassName}>Disabled Tab</TabPanel>
				<TabPanel class={panelClassName}>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum reiciendis nobis quibusdam
					distinctio harum rem earum deserunt veritatis repellat sunt!
				</TabPanel>
			</TabPanels>
		</TabGroup>
			<TabGroup initialIndex={1} {finite} {manual} {vertical}>
				<TabList>
					<Tab class={className}>Lorem, ipsum dolor.</Tab>
					<Tab class={className}>Lorem ipsum dolor sit.</Tab>
					<Tab class={className} {disabled}>Lorem, ipsum.</Tab>
				</TabList>
				<TabPanels>
					<TabPanel class={panelClassName}>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo, praesentium perspiciatis
						recusandae rerum alias ducimus ab minus non consequuntur quidem.
					</TabPanel>
					<TabPanel class={panelClassName}>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam impedit dignissimos natus
						sapiente quos eligendi!
					</TabPanel>
					<TabPanel class={panelClassName}>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Natus ut ex odit placeat
						dicta, nulla odio enim earum quos omnis, dolorum cum pariatur dolorem veniam, nostrum
						dignissimos. Iste, exercitationem provident!
					</TabPanel>
				</TabPanels>
			</TabGroup>
	</div>
</Page>