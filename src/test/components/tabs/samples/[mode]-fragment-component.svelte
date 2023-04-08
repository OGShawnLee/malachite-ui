<script lang="ts">
  import type { Maybe } from '$lib/types';
  import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '$lib';

  export let disabled: Maybe<boolean> = undefined;
  export let index: Maybe<number> = undefined;
  export let finite: Maybe<boolean> = undefined;
  export let manual: Maybe<boolean> = undefined;
  export let vertical: Maybe<boolean> = undefined;
</script>

<TabGroup initialIndex={index} {finite} {manual} {vertical} data-testid="tab-group">
  <TabList as="fragment" let:tablist>
    <div data-testid="tab-list" use:tablist>
      <Tab as="fragment" let:isSelected let:tab>
        <button data-testid="tab" use:tab {disabled}>
          1 <span data-testid="binding-selected"> {isSelected} </span>
        </button>
      </Tab>
      <Tab as="fragment" let:isSelected let:tab>
        <button data-testid="tab" use:tab>
          2 <span data-testid="binding-selected"> {isSelected} </span>
        </button>
      </Tab>
      <Tab as="fragment" let:isSelected let:tab>
        <button data-testid="tab" use:tab {disabled}>
          3 <span data-testid="binding-selected"> {isSelected} </span>
        </button>
      </Tab>
      <Tab as="fragment" let:isSelected let:tab>
        <button data-testid="tab" use:tab>
          4 <span data-testid="binding-selected"> {isSelected} </span>
        </button>
      </Tab>
      <Tab as="fragment" let:isSelected let:tab>
        <button data-testid="tab" use:tab {disabled}>
          5 <span data-testid="binding-selected"> {isSelected} </span>
        </button>
      </Tab>
    </div>
  </TabList>
  <TabPanels data-testid="tab-panels">
    <TabPanel as="fragment" let:panel>
      <div data-testid="tab-panel" use:panel>Panel 1</div>
    </TabPanel>
    <TabPanel as="fragment" let:panel>
      <div data-testid="tab-panel" use:panel>Panel 2</div>
    </TabPanel>
    <TabPanel as="fragment" let:panel>
      <div data-testid="tab-panel" use:panel>Panel 3</div>
    </TabPanel>
    <TabPanel as="fragment" let:panel>
      <div data-testid="tab-panel" use:panel>Panel 4</div>
    </TabPanel>
    <TabPanel as="fragment" let:panel>
      <div data-testid="tab-panel" use:panel>Panel 5</div>
    </TabPanel>
  </TabPanels>
</TabGroup>
