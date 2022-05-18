<script lang="ts">
  import { Tab, TabGroup, TabPanel } from '$lib/components';

  export let vertical: boolean | undefined = undefined;
</script>

<TabGroup {vertical} let:tabList let:tabPanels>
  <div use:tabList data-testid="tablist">
    <Tab as="slot" let:tab>
      <button use:tab> Tab 1 </button>
    </Tab>
    <Tab as="slot" let:tab>
      <button use:tab> Tab 2 </button>
    </Tab>
    <Tab as="slot" let:tab>
      <button use:tab> Tab 3 </button>
    </Tab>
  </div>
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
</TabGroup>
