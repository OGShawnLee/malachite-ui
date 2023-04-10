<script lang="ts">
  import type { Forwarder, RenderElementTagName } from '$lib/types';
  import { Accordion, AccordionButton, AccordionHeader, AccordionItem, AccordionPanel } from '$lib';

  interface ComponentConfig {
    as?: RenderElementTagName;
    use?: Forwarder.Actions;
    rest?: {};
  }

  export let item: ComponentConfig = {};
  export let header: ComponentConfig = {};
  export let button: ComponentConfig = {};
  export let panel: ComponentConfig = {};
</script>

<Accordion>
  <AccordionItem data-testid="item" as={item.as} use={item.use} {...item.rest}>
    <AccordionHeader data-testid="header" as={header.as} use={header.use} {...header.rest}>
      <AccordionButton data-testid="button" as={button.as} use={button.use} {...button.rest}>
        Toggle
      </AccordionButton>
    </AccordionHeader>
    <AccordionPanel data-testid="panel" as={panel.as} use={panel.use} {...panel.rest}>
      Item
    </AccordionPanel>
  </AccordionItem>
</Accordion>
