<script lang="ts">
  import { Accordion, AccordionItem } from '$lib/components';

  export let finite: boolean | undefined = undefined;
  export let open: boolean | undefined = undefined;
</script>

<Accordion as="slot" {finite} let:accordion>
  <div data-testid="accordion" use:accordion>
    <AccordionItem data-testid="item" let:close let:header let:button let:panel>
      <h2 data-testid="header" use:header>
        <button data-testid="button" use:button> Button 1 </button>
      </h2>
      <div slot="panel" data-testid="panel" use:panel>
        Panel 1
        <button on:click={close}>Close Item</button>
      </div>
    </AccordionItem>
    <AccordionItem data-testid="item" let:close let:header let:button let:panel {open}>
      <h2 data-testid="header" use:header>
        <button data-testid="button" use:button> Button 2 </button>
      </h2>
      <div slot="panel" data-testid="panel" use:panel>
        Panel 2
        <button on:click={close}>Close Item</button>
      </div>
    </AccordionItem>
    <AccordionItem data-testid="item" let:close let:header let:button let:panel {open}>
      <h2 data-testid="header" use:header>
        <button data-testid="button" use:button> Button 3 </button>
      </h2>
      <div slot="panel" data-testid="panel" use:panel>
        Panel 3
        <button on:click={close}>Close Item</button>
      </div>
    </AccordionItem>
  </div>
</Accordion>
