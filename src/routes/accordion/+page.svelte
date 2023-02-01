<script>
  import { Accordion, AccordionItem, AccordionButton, AccordionPanel } from '$lib';
</script>

<Accordion>
  <AccordionItem>
    <AccordionButton>First Item</AccordionButton>
    <AccordionPanel let:close>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consectetur facilis nemo quaerat
        tempora ab earum nulla a placeat quibusdam soluta?
      </p>
      <button on:click={close}>Close</button>
    </AccordionPanel>
  </AccordionItem>
  <AccordionItem>
    <AccordionButton disabled>Second Item</AccordionButton>
    <AccordionPanel let:close>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consectetur facilis nemo quaerat
        tempora ab earum nulla a placeat quibusdam soluta?
      </p>
      <button on:click={close}>Close</button>
    </AccordionPanel>
  </AccordionItem>
  <AccordionItem>
    <AccordionButton>Third Item</AccordionButton>
    <AccordionPanel let:close>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consectetur facilis nemo quaerat
        tempora ab earum nulla a placeat quibusdam soluta?
      </p>
      <button on:click={close}>Close</button>
    </AccordionPanel>
  </AccordionItem>
</Accordion>
