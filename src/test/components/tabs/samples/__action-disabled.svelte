<script lang="ts">
  import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '$lib';

  export let index: number | undefined = undefined;
</script>

<TabGroup {index}>
  <TabList data-testid="tablist">
    <Tab as="slot" let:tab>
      <button disabled use:tab> Tab 1 </button>
    </Tab>
    <Tab>Tab 2</Tab>
    <Tab as="slot" let:tab>
      <button disabled use:tab> Tab 3 </button>
    </Tab>
    <Tab>Tab 4</Tab>
  </TabList>
  <TabPanels data-testid="tabpanels">
    <TabPanel>Panel 1</TabPanel>
    <TabPanel>Panel 2</TabPanel>
    <TabPanel>Panel 3</TabPanel>
    <TabPanel>Panel 4</TabPanel>
  </TabPanels>
</TabGroup>
