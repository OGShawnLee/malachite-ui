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
  <TabList data-testid="tab-list">
    <Tab data-testid="tab" {disabled} let:isDisabled let:isSelected>
      1 <span data-testid="binding-selected"> {isSelected} </span>
      <span data-testid="binding-disabled"> {isDisabled} </span>
    </Tab>
    <Tab data-testid="tab" let:isDisabled let:isSelected>
      2 <span data-testid="binding-selected"> {isSelected} </span>
      <span data-testid="binding-disabled"> {isDisabled} </span>
    </Tab>
    <Tab data-testid="tab" {disabled} let:isDisabled let:isSelected>
      3 <span data-testid="binding-selected"> {isSelected} </span>
      <span data-testid="binding-disabled"> {isDisabled} </span>
    </Tab>
    <Tab data-testid="tab" let:isDisabled let:isSelected>
      4 <span data-testid="binding-selected"> {isSelected} </span>
      <span data-testid="binding-disabled"> {isDisabled} </span>
    </Tab>
    <Tab data-testid="tab" {disabled} let:isDisabled let:isSelected>
      5 <span data-testid="binding-selected"> {isSelected} </span>
      <span data-testid="binding-disabled"> {isDisabled} </span>
    </Tab>
  </TabList>
  <TabPanels data-testid="tab-panels">
    <TabPanel data-testid="tab-panel">Panel 1</TabPanel>
    <TabPanel data-testid="tab-panel">Panel 2</TabPanel>
    <TabPanel data-testid="tab-panel">Panel 3</TabPanel>
    <TabPanel data-testid="tab-panel">Panel 4</TabPanel>
    <TabPanel data-testid="tab-panel">Panel 5</TabPanel>
  </TabPanels>
</TabGroup>
