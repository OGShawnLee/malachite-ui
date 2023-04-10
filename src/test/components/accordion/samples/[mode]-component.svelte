<script lang="ts">
  import type { Maybe } from '$lib/types';
  import { Accordion, AccordionButton, AccordionHeader, AccordionItem, AccordionPanel } from '$lib';

  export let disabled: Maybe<boolean> = undefined;
  export let finite: Maybe<boolean> = undefined;
  export let isShowingPanel: Maybe<boolean> = true;
  export let noNavigation: Maybe<boolean> = undefined;
  export let unique: Maybe<boolean> = undefined;
</script>

<Accordion data-testid="accordion-container" disabled={noNavigation} {finite} {unique}>
  <AccordionItem data-testid="accordion-item" let:isOpen>
    <span data-testid="binding-open-item">{isOpen}</span>
    <AccordionHeader data-testid="accordion-header">
      <AccordionButton data-testid="accordion-button" {disabled} let:isDisabled let:isOpen>
        <span data-testid="binding-disabled">{isDisabled}</span>
        <span data-testid="binding-open-button">{isOpen}</span>
      </AccordionButton>
    </AccordionHeader>
    {#if isShowingPanel}
      <AccordionPanel data-testid="accordion-panel" let:close>
        <button data-testid="button-close" on:click={close}> Close </button>
      </AccordionPanel>
    {/if}
  </AccordionItem>
  <AccordionItem data-testid="accordion-item" let:isOpen>
    <span data-testid="binding-open-item">{isOpen}</span>
    <AccordionHeader data-testid="accordion-header">
      <AccordionButton data-testid="accordion-button" let:isDisabled let:isOpen>
        <span data-testid="binding-disabled">{isDisabled}</span>
        <span data-testid="binding-open-button">{isOpen}</span>
      </AccordionButton>
    </AccordionHeader>
    <AccordionPanel data-testid="accordion-panel" let:close>
      <button data-testid="button-close" on:click={close}> Close </button>
    </AccordionPanel>
  </AccordionItem>
  <AccordionItem data-testid="accordion-item" let:isOpen>
    <span data-testid="binding-open-item">{isOpen}</span>
    <AccordionHeader data-testid="accordion-header">
      <AccordionButton data-testid="accordion-button" {disabled} let:isDisabled let:isOpen>
        <span data-testid="binding-disabled">{isDisabled}</span>
        <span data-testid="binding-open-button">{isOpen}</span>
      </AccordionButton>
    </AccordionHeader>
    <AccordionPanel data-testid="accordion-panel" let:close>
      <button data-testid="button-close" on:click={close}> Close </button>
    </AccordionPanel>
  </AccordionItem>
  <AccordionItem data-testid="accordion-item" let:isOpen>
    <span data-testid="binding-open-item">{isOpen}</span>
    <AccordionHeader data-testid="accordion-header">
      <AccordionButton data-testid="accordion-button" let:isDisabled let:isOpen>
        <span data-testid="binding-disabled">{isDisabled}</span>
        <span data-testid="binding-open-button">{isOpen}</span>
      </AccordionButton>
    </AccordionHeader>
    <AccordionPanel data-testid="accordion-panel" let:close>
      <button data-testid="button-close" on:click={close}> Close </button>
    </AccordionPanel>
  </AccordionItem>
  <AccordionItem data-testid="accordion-item" let:isOpen>
    <span data-testid="binding-open-item">{isOpen}</span>
    <AccordionHeader data-testid="accordion-header">
      <AccordionButton data-testid="accordion-button" {disabled} let:isDisabled let:isOpen>
        <span data-testid="binding-disabled">{isDisabled}</span>
        <span data-testid="binding-open-button">{isOpen}</span>
      </AccordionButton>
    </AccordionHeader>
    <AccordionPanel data-testid="accordion-panel" let:close>
      <button data-testid="button-close" on:click={close}> Close </button>
    </AccordionPanel>
  </AccordionItem>
</Accordion>
