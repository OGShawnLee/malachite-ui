<script lang="ts">
  import type { Maybe } from '$lib/types';
  import { Accordion, AccordionButton, AccordionHeader, AccordionItem, AccordionPanel } from '$lib';

  export let disabled: Maybe<boolean> = undefined;
  export let finite: Maybe<boolean> = undefined;
  export let isShowingPanel: Maybe<boolean> = true;
  export let noNavigation: Maybe<boolean> = undefined;
  export let unique: Maybe<boolean> = undefined;
</script>

<Accordion as="fragment" disabled={noNavigation} {finite} {unique} let:accordion>
  <div data-testid="accordion-container" use:accordion>
    <AccordionItem data-testid="accordion-item" let:close let:isOpen>
      <span data-testid="binding-open-item">{isOpen}</span>
      <AccordionHeader as="fragment" let:heading>
        <h2 data-testid="accordion-header" use:heading>
          <AccordionButton as="fragment" let:isOpen let:button>
            <button data-testid="accordion-button" {disabled} use:button>
              <span data-testid="binding-open-button">{isOpen}</span>
            </button>
          </AccordionButton>
        </h2>
      </AccordionHeader>
      {#if isShowingPanel}
        <AccordionPanel as="fragment" let:panel>
          <div data-testid="accordion-panel" use:panel>
            <button data-testid="button-close" on:click={close}> Close </button>
          </div>
        </AccordionPanel>
      {/if}
    </AccordionItem>
    <AccordionItem data-testid="accordion-item" let:close let:isOpen>
      <span data-testid="binding-open-item">{isOpen}</span>
      <AccordionHeader as="fragment" let:heading>
        <h2 data-testid="accordion-header" use:heading>
          <AccordionButton as="fragment" let:isOpen let:button>
            <button data-testid="accordion-button" use:button>
              <span data-testid="binding-open-button">{isOpen}</span>
            </button>
          </AccordionButton>
        </h2>
      </AccordionHeader>
      <AccordionPanel as="fragment" let:panel>
        <div data-testid="accordion-panel" use:panel>
          <button data-testid="button-close" on:click={close}> Close </button>
        </div>
      </AccordionPanel>
    </AccordionItem>
    <AccordionItem data-testid="accordion-item" let:close let:isOpen>
      <span data-testid="binding-open-item">{isOpen}</span>
      <AccordionHeader as="fragment" let:heading>
        <h2 data-testid="accordion-header" use:heading>
          <AccordionButton as="fragment" let:isOpen let:button>
            <button data-testid="accordion-button" {disabled} use:button>
              <span data-testid="binding-open-button">{isOpen}</span>
            </button>
          </AccordionButton>
        </h2>
      </AccordionHeader>
      <AccordionPanel as="fragment" let:panel>
        <div data-testid="accordion-panel" use:panel>
          <button data-testid="button-close" on:click={close}> Close </button>
        </div>
      </AccordionPanel>
    </AccordionItem>
    <AccordionItem data-testid="accordion-item" let:close let:isOpen>
      <span data-testid="binding-open-item">{isOpen}</span>
      <AccordionHeader as="fragment" let:heading>
        <h2 data-testid="accordion-header" use:heading>
          <AccordionButton as="fragment" let:isOpen let:button>
            <button data-testid="accordion-button" use:button>
              <span data-testid="binding-open-button">{isOpen}</span>
            </button>
          </AccordionButton>
        </h2>
      </AccordionHeader>
      <AccordionPanel as="fragment" let:panel>
        <div data-testid="accordion-panel" use:panel>
          <button data-testid="button-close" on:click={close}> Close </button>
        </div>
      </AccordionPanel>
    </AccordionItem>
    <AccordionItem data-testid="accordion-item" let:close let:isOpen>
      <span data-testid="binding-open-item">{isOpen}</span>
      <AccordionHeader as="fragment" let:heading>
        <h2 data-testid="accordion-header" use:heading>
          <AccordionButton as="fragment" let:isOpen let:button>
            <button data-testid="accordion-button" {disabled} use:button>
              <span data-testid="binding-open-button">{isOpen}</span>
            </button>
          </AccordionButton>
        </h2>
      </AccordionHeader>
      <AccordionPanel as="fragment" let:panel>
        <div data-testid="accordion-panel" use:panel>
          <button data-testid="button-close" on:click={close}> Close </button>
        </div>
      </AccordionPanel>
    </AccordionItem>
  </div>
</Accordion>
