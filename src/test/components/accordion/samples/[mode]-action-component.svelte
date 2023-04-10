<script lang="ts">
  import type { Maybe } from '$lib/types';
  import { Accordion, AccordionItem } from '$lib';

  export let disabled: Maybe<boolean> = undefined;
  export let finite: Maybe<boolean> = undefined;
  export let isShowingPanel: Maybe<boolean> = true;
  export let noNavigation: Maybe<boolean> = undefined;
  export let unique: Maybe<boolean> = undefined;
</script>

<Accordion data-testid="accordion-container" disabled={noNavigation} {finite} {unique}>
  <AccordionItem let:button let:heading let:isOpen>
    <span data-testid="binding-open-item">{isOpen}</span>
    <div data-tesstid="accordion-item">
      <h2 data-testid="accordion-header" use:heading>
        <button data-testid="accordion-button" {disabled} use:button>
          <span data-testid="binding-open-button">{isOpen}</span>
        </button>
      </h2>
    </div>
    <svelte:fragment slot="panel" let:panel let:close>
      {#if isShowingPanel}
        <div data-testid="accordion-panel" use:panel>
          <button data-testid="button-close" on:click={close}> Close </button>
        </div>
      {/if}
    </svelte:fragment>
  </AccordionItem>
  <AccordionItem let:button let:heading let:panel let:isOpen>
    <span data-testid="binding-open-item">{isOpen}</span>
    <div data-tesstid="accordion-item">
      <h2 data-testid="accordion-header" use:heading>
        <button data-testid="accordion-button" use:button>
          <span data-testid="binding-open-button">{isOpen}</span>
        </button>
      </h2>
    </div>
    <div data-testid="accordion-panel" slot="panel" use:panel let:close>
      <button data-testid="button-close" on:click={close}> Close </button>
    </div>
  </AccordionItem>
  <AccordionItem let:button let:heading let:panel let:isOpen>
    <span data-testid="binding-open-item">{isOpen}</span>
    <div data-tesstid="accordion-item">
      <h2 data-testid="accordion-header" use:heading>
        <button data-testid="accordion-button" {disabled} use:button>
          <span data-testid="binding-open-button">{isOpen}</span>
        </button>
      </h2>
    </div>
    <div data-testid="accordion-panel" slot="panel" use:panel let:close>
      <button data-testid="button-close" on:click={close}> Close </button>
    </div>
  </AccordionItem>
  <AccordionItem let:button let:heading let:panel let:isOpen>
    <span data-testid="binding-open-item">{isOpen}</span>
    <div data-tesstid="accordion-item">
      <h2 data-testid="accordion-header" use:heading>
        <button data-testid="accordion-button" use:button>
          <span data-testid="binding-open-button">{isOpen}</span>
        </button>
      </h2>
    </div>
    <div data-testid="accordion-panel" slot="panel" use:panel let:close>
      <button data-testid="button-close" on:click={close}> Close </button>
    </div>
  </AccordionItem>
  <AccordionItem let:button let:heading let:panel let:isOpen>
    <span data-testid="binding-open-item">{isOpen}</span>
    <div data-tesstid="accordion-item">
      <h2 data-testid="accordion-header" use:heading>
        <button data-testid="accordion-button" {disabled} use:button>
          <span data-testid="binding-open-button">{isOpen}</span>
        </button>
      </h2>
    </div>
    <div data-testid="accordion-panel" slot="panel" use:panel let:close>
      <button data-testid="button-close" on:click={close}> Close </button>
    </div>
  </AccordionItem>
</Accordion>
