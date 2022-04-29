<script lang="ts">
	import type { Readable } from 'svelte/store';
	import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '$lib/components';

	export let index: number | undefined = undefined;
	export let manual: Readable<boolean> | boolean | undefined = undefined;
	export let vertical: Readable<boolean> | boolean | undefined = undefined;

	export let disabledEdges = false;
</script>

<TabGroup {index} {manual} {vertical}>
	<TabList data-testid="tablist">
		<Tab disabled={disabledEdges}>Tab 1</Tab>
		<Tab>Tab 2</Tab>
		<Tab disabled>Tab 3</Tab>
		<Tab disabled>Tab 4</Tab>
		<Tab disabled>Tab 5</Tab>
		<Tab>Tab 6</Tab>
		<Tab disabled={disabledEdges}>Tab 7</Tab>
	</TabList>
	<TabPanels data-testid="tabpanels">
		<TabPanel>Panel 1</TabPanel>
		<TabPanel>Panel 2</TabPanel>
		<TabPanel>Panel 3</TabPanel>
		<TabPanel>Panel 4</TabPanel>
		<TabPanel>Panel 5</TabPanel>
		<TabPanel>Panel 6</TabPanel>
		<TabPanel>Panel 7</TabPanel>
	</TabPanels>
</TabGroup>
