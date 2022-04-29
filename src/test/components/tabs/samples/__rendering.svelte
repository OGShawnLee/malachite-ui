<script lang="ts">
	import type { Forwarder, RenderElementTagName } from '$lib/types';
	import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '$lib/components';

	interface ComponentConfig {
		as?: RenderElementTagName;
		use?: Forwarder.Actions;
		rest?: {};
	}

	export let tablist: ComponentConfig = {};
	export let tabpanels: ComponentConfig = {};
	export let tab: ComponentConfig = {};
	export let panel: ComponentConfig = {};
</script>

<TabGroup>
	<TabList as={tablist.as} use={tablist.use} {...tablist.rest} data-testid="tablist">
		<Tab as={tab.as} use={tab.use} {...tab.rest} data-testid="tab">Tab</Tab>
	</TabList>
	<TabPanels as={tabpanels.as} use={tabpanels.use} {...tabpanels.rest} data-testid="tabpanels">
		<TabPanel as={panel.as} use={panel.use} {...panel.rest} data-testid="panel">Panel</TabPanel>
	</TabPanels>
</TabGroup>
