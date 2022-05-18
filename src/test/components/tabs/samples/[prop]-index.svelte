<script lang="ts">
  import type { Nullable } from '$lib/types';
  import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '$lib/components';

  export let index: number | undefined = undefined;
  export let disabled: Nullable<boolean> = undefined;
</script>

<TabGroup {index}>
  <TabList data-testid="tablist">
    <Tab {disabled}>Tab 1</Tab>
    <Tab>Tab 2</Tab>
    <Tab {disabled}>Tab 3</Tab>
    <Tab>Tab 4</Tab>
    <Tab {disabled}>Tab 5</Tab>
  </TabList>
  <TabPanels data-testid="tabpanels">
    <TabPanel>Panel 1</TabPanel>
    <TabPanel>Panel 2</TabPanel>
    <TabPanel>Panel 3</TabPanel>
    <TabPanel>Panel 4</TabPanel>
    <TabPanel>Panel 5</TabPanel>
  </TabPanels>
</TabGroup>
