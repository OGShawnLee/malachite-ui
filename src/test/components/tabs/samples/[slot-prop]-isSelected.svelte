<script lang="ts">
	import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '$lib/components';

	export let vertical: boolean | undefined = undefined;
</script>

<TabGroup {vertical}>
	<TabList as="slot" let:tabList>
		<div use:tabList data-testid="tablist">
			<Tab as="slot" let:tab let:isSelected>
				<span data-testid="tab-1-isSelected-holder">
					{isSelected}
				</span>
				<button use:tab> Tab 1 </button>
			</Tab>
			<Tab as="slot" let:tab let:isSelected>
				<span data-testid="tab-2-isSelected-holder">
					{isSelected}
				</span>
				<button use:tab> Tab 2 </button>
			</Tab>
			<Tab as="slot" let:tab let:isSelected>
				<span data-testid="tab-3-isSelected-holder">
					{isSelected}
				</span>
				<button use:tab> Tab 3 </button>
			</Tab>
		</div>
	</TabList>
	<TabPanels as="slot" let:tabPanels>
		<div use:tabPanels data-testid="tabpanels">
			<TabPanel as="slot" let:panel>
				<div use:panel>Panel 1</div>
			</TabPanel>
			<TabPanel as="slot" let:panel>
				<div use:panel>Panel 2</div>
			</TabPanel>
			<TabPanel as="slot" let:panel>
				<div use:panel>Panel 3</div>
			</TabPanel>
		</div>
	</TabPanels>
</TabGroup>
