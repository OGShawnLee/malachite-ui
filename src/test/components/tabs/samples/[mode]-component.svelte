<script lang="ts">
	import type { Readable } from 'svelte/store';
	import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '$lib/components';

	export let index: number | undefined = undefined;
	export let manual: Readable<boolean> | boolean | undefined = undefined;
	export let vertical: Readable<boolean> | boolean | undefined = undefined;
	export let disabled = false;
</script>

<button> External </button>

<TabGroup {index} {manual} {vertical}>
	<TabList data-testid="tablist">
		<Tab>Tab 1</Tab>
		<Tab {disabled}>Tab 2</Tab>
		<Tab>Tab 3</Tab>
	</TabList>
	<TabPanels data-testid="tabpanels">
		<TabPanel>Panel 1</TabPanel>
		<TabPanel>Panel 2</TabPanel>
		<TabPanel>Panel 3</TabPanel>
	</TabPanels>
</TabGroup>
