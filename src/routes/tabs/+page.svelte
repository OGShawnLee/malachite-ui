<script lang="ts">
  import { Tab, TabGroup, TabPanel } from '$lib/components';
  import { useClassNameResolver } from '$lib/hooks';
  import { useRange, useToggle } from '@test-utils';

  const range = useRange(6, { min: 0 });
  const [show, toggleShow] = useToggle();
  let isDisabled = false;
  let [manual, toggleManual] = useToggle(false);
  let [vertical, toggleVertical] = useToggle(false);

  let index = 360;

  const className = useClassNameResolver<'isDisabled' | 'isSelected'>({
    base: 'px-6 py-2 font-medium focus:(ring-2 ring-black)',
    disabled: 'opacity-40',
    selected: { on: 'bg-green-800 focus:(bg-amber-600 text-white)', off: 'focus:text-green-400' }
  });
</script>

<input type="number" bind:value={index} />

<main class="container mx-auto my-8 | flex flex-col gap-12 h-[1000px]">
  <section>
    <button on:click={range.increment}> Increase </button>
    <button on:click={range.decrement}> Decrement </button>

    <button on:click={toggleManual}> Toggle Manual </button>
    <button on:click={toggleVertical}> Toggle Vertical </button>

    <TabGroup order bind:index {manual} {vertical} let:tabList let:tabPanels>
      <div use:tabList>
        {#each $range as index}
          <Tab as="slot" disabled={index % 2 === 0} let:tab let:isSelected>
            <button use:tab class="focus:(ring-2 ring-black)" class:text-green-400={isSelected}>
              Tab {index}
            </button>
          </Tab>
        {/each}
      </div>
      <div use:tabPanels>
        {#each $range as index}
          <TabPanel>Panel {index}</TabPanel>
        {/each}
      </div>
    </TabGroup>
  </section>

  <section>
    <button on:click={() => (isDisabled = !isDisabled)}>Disable 3rd</button>

    <TabGroup let:tabList let:tabPanels>
      <div use:tabList>
        <Tab class="focus:(ring-2 ring-black)">Tab 1</Tab>
        <Tab class="focus:(ring-2 ring-black)">Tab 2</Tab>
        <Tab disabled={isDisabled} class="focus:(ring-2 ring-black)">Tab 3</Tab>
        <Tab class="focus:(ring-2 ring-black)">Tab 4</Tab>
        <Tab disabled={isDisabled} class="focus:(ring-2 ring-black)">Tab 5</Tab>
      </div>
      <div use:tabPanels>
        <TabPanel>Panel 1</TabPanel>
        <TabPanel>Panel 2</TabPanel>
        <TabPanel>Panel 3</TabPanel>
        <TabPanel>Panel 4</TabPanel>
        <TabPanel>Panel 5</TabPanel>
      </div>
    </TabGroup>
  </section>

  <section>
    <button on:click={toggleShow}>Toggle Show {$show}</button>

    <TabGroup order let:tabList let:tabPanels>
      <div use:tabList>
        <!-- can order this based on the dom child order but do we really need ordering? -->
        {#if $show}
          <Tab as="slot" let:tab let:isSelected>
            <button use:tab class="focus:(ring-2 ring-black)" class:text-green-400={isSelected}>
              Tab 1
            </button>
          </Tab>
          <Tab as="slot" let:tab let:isSelected>
            <button use:tab class="focus:(ring-2 ring-black)" class:text-green-400={isSelected}>
              Tab 2
            </button>
          </Tab>
        {/if}
        <Tab as="slot" let:tab let:isSelected>
          <button use:tab class="focus:(ring-2 ring-black)" class:text-green-400={isSelected}>
            Tab 3
          </button>
        </Tab>
        <Tab as="slot" let:tab let:isSelected>
          <button use:tab class="focus:(ring-2 ring-black)" class:text-green-400={isSelected}>
            Tab 4
          </button>
        </Tab>
      </div>
      <div use:tabPanels>
        <!-- {#if $show} cant order this since there is only one rendered at a time -> 1 child of tabPanels -->
        <TabPanel>Panel 1</TabPanel>
        <TabPanel>Panel 2</TabPanel>
        <!-- {/if} -->
        <TabPanel>Panel 3</TabPanel>
        <TabPanel>Panel 4</TabPanel>
      </div>
    </TabGroup>
  </section>

  <section>
    <TabGroup manual let:tabList let:tabPanels>
      <div use:tabList>
        <Tab as="slot" let:tab let:isSelected>
          <button use:tab class="focus:(ring-2 ring-black)" class:text-green-400={isSelected}>
            Tab 1 {isSelected}
          </button>
        </Tab>
        <Tab as="slot" let:tab let:isSelected>
          <button use:tab class="focus:(ring-2 ring-black)" class:text-green-400={isSelected}>
            Tab 2 {isSelected}
          </button>
        </Tab>
        <Tab as="slot" let:tab let:isSelected>
          <button use:tab class="focus:(ring-2 ring-black)" class:text-green-400={isSelected}>
            Tab 3 {isSelected}
          </button>
        </Tab>
        <Tab as="slot" let:tab let:isSelected>
          <button use:tab class="focus:(ring-2 ring-black)" class:text-green-400={isSelected}>
            Tab 4 {isSelected}
          </button>
        </Tab>
      </div>
      <div use:tabPanels>
        <TabPanel>Panel 1</TabPanel>
        <TabPanel>Panel 2</TabPanel>
        <TabPanel>Panel 3</TabPanel>
        <TabPanel>Panel 4</TabPanel>
      </div>
    </TabGroup>
  </section>

  <section>
    <TabGroup manual let:tabList let:tabPanels>
      <div use:tabList>
        <Tab class={className}>Tab 1</Tab>
        <Tab class={className}>Tab 2</Tab>
        <Tab class={className} disabled>Tab 3</Tab>
      </div>
      <div use:tabPanels>
        <TabPanel>Panel 1</TabPanel>
        <TabPanel>Panel 2</TabPanel>
        <TabPanel>Panel 3</TabPanel>
      </div>
    </TabGroup>
  </section>
</main>
