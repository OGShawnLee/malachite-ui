<script lang="ts">
  import { Accordion, AccordionItem, AccordionHeader } from '$lib';

  export let level: string | number | undefined = undefined;
</script>

<Accordion>
  <AccordionItem>
    <AccordionHeader {level} data-testid="header">Header 1</AccordionHeader>
  </AccordionItem>
  <AccordionItem let:header>
    <h2 use:header={level} data-testid="header">Header 2</h2>
  </AccordionItem>
</Accordion>
