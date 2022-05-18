<script lang="ts">
  import type { Readable } from 'svelte/store';
  import {
    Accordion,
    AccordionButton,
    AccordionHeader,
    AccordionItem,
    AccordionPanel
  } from '$lib/components';

  export let finite: Readable<boolean> | boolean | undefined = undefined;
  export let open: boolean | undefined = undefined;
</script>

<Accordion data-testid="accordion" {finite}>
  <AccordionItem data-testid="item" let:isOpen let:close>
    <AccordionHeader data-testid="header">
      <AccordionButton disabled data-testid="button">
        <span data-testid="item-isOpen"> {isOpen} </span>
      </AccordionButton>
    </AccordionHeader>
    <AccordionPanel data-testid="panel">
      Panel 1
      <button on:click={close}>Close Item</button>
    </AccordionPanel>
  </AccordionItem>
  <AccordionItem data-testid="item" {open}>
    <AccordionHeader data-testid="header" let:isOpen>
      <AccordionButton data-testid="button">
        <span data-testid="header-isOpen"> {isOpen} </span>
      </AccordionButton>
    </AccordionHeader>
    <AccordionPanel data-testid="panel" let:close>
      Panel 2
      <button on:click={close}>Close Panel</button>
    </AccordionPanel>
  </AccordionItem>
  <AccordionItem data-testid="item" {open}>
    <AccordionHeader data-testid="header">
      <AccordionButton disabled data-testid="button" let:isOpen>
        <span data-testid="button-isOpen"> {isOpen} </span>
      </AccordionButton>
    </AccordionHeader>
    <AccordionPanel data-testid="panel" let:close>
      Panel 3
      <button on:click={close}>Close</button>
    </AccordionPanel>
  </AccordionItem>
  <AccordionItem data-testid="item" {open}>
    <AccordionHeader data-testid="header">
      <AccordionButton data-testid="button" let:isOpen>
        <span data-testid="button-isOpen"> {isOpen} </span>
      </AccordionButton>
    </AccordionHeader>
    <AccordionPanel data-testid="panel" let:close>
      Panel 4
      <button on:click={close}>Close</button>
    </AccordionPanel>
  </AccordionItem>
  <AccordionItem data-testid="item">
    <AccordionHeader data-testid="header">
      <AccordionButton disabled data-testid="button" let:isOpen>
        <span data-testid="button-isOpen"> {isOpen} </span>
      </AccordionButton>
    </AccordionHeader>
    <AccordionPanel data-testid="panel" let:close>
      Panel 5
      <button on:click={close}>Close</button>
    </AccordionPanel>
  </AccordionItem>
</Accordion>
