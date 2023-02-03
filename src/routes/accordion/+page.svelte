<script>
  import { Page } from '@app/layout';
  import { Toggle } from '@app/components';
  import { Accordion, AccordionButton, AccordionHeader, AccordionItem, AccordionPanel } from '$lib';
  import { slide } from 'svelte/transition';

  let finite = false;
  let unique = true;
  let disabled = false;
  let disabledItem = true;
</script>

<Page title="Accordion">
  <div class="flex items-center gap-3" slot="options">
    <Toggle text="Toggle Disabled Navigation" bind:checked={disabled} />
    <Toggle text="Toggle Disabled Item" bind:checked={disabledItem} />
    <Toggle text="Toggle Finite" bind:checked={finite} />
    <Toggle text="Toggle Unique" bind:checked={unique} />
  </div>
  <Accordion class="grid gap-9" {disabled} {finite} {unique}>
    <AccordionItem let:panel>
      <AccordionHeader class="m-0">
        <AccordionButton class="button button--medium">
          Lorem ipsum dolor sit amet consectetur.
        </AccordionButton>
      </AccordionHeader>
      <div class="p-8 bg-neutral-800" slot="panel" transition:slide|local use:panel>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quam sequi deserunt at deleniti
          delectus, voluptatibus illo facere dignissimos fugiat sint natus eum dolorum temporibus
          rerum ex saepe commodi tempora numquam.
        </p>
      </div>
    </AccordionItem>
    <AccordionItem>
      <AccordionHeader class="m-0">
        <AccordionButton
          class={{ base: 'button button--medium', disabled: 'opacity-50' }}
          disabled={disabledItem}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing.
        </AccordionButton>
      </AccordionHeader>
      <div slot="panel" transition:slide|local>
        <AccordionPanel class="p-8 | grid gap-4.5 bg-neutral-800" static>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur id, eum minus
            deleniti dolorem eius odio vitae. Natus architecto, nobis illo magnam modi deserunt fuga
            voluptates?
          </p>
        </AccordionPanel>
      </div>
    </AccordionItem>
    <AccordionItem>
      <AccordionHeader class="m-0">
        <AccordionButton class="button button--medium">
          Lorem ipsum dolor sit amet consectetur adipisicing.
        </AccordionButton>
      </AccordionHeader>
      <div slot="panel" transition:slide|local>
        <AccordionPanel class="p-8 | grid gap-4.5 bg-neutral-800" static>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur id, eum minus
            deleniti dolorem eius odio vitae. Natus architecto, nobis illo magnam modi deserunt fuga
            voluptates?
          </p>
        </AccordionPanel>
      </div>
    </AccordionItem>
    <AccordionItem let:close>
      <AccordionHeader class="m-0">
        <AccordionButton class="button button--medium">Lorem ipsum dolor sit.</AccordionButton>
      </AccordionHeader>
      <div slot="panel" transition:slide|local>
        <AccordionPanel class="p-8 | grid gap-4.5 bg-neutral-800" static>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque nam labore quae
            quaerat, libero fuga?
          </p>
          <button class="button button--small" on:click={close}> Close </button>
        </AccordionPanel>
      </div>
    </AccordionItem>
  </Accordion>
</Page>
