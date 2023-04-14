<script lang="ts">
  import type { Maybe } from '$lib/types';
  import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '$lib';
  import { useRange } from '@test-utils';

  export let amount = useRange(1);
  export let disabled: Maybe<boolean> = undefined;
  export let horizontal: Maybe<boolean> = undefined;
  export let infinite: Maybe<boolean> = undefined;
  export let isShowingPanel = true;
  export let value = 'Vincent Law';
</script>

<span data-testid="binding-value-global">{value}</span>
<Listbox {horizontal} {infinite} bind:value let:isOpen let:value>
  <span data-testid="binding-value-listbox">{value}</span>
  <span data-testid="binding-open-listbox">{isOpen}</span>
  {#each $amount as index (index)}
    <ListboxLabel as="fragment" let:isOpen let:label>
      <label data-testid="listbox-label" use:label>
        <span data-testid="binding-open-label">{isOpen}</span>
      </label>
    </ListboxLabel>
  {/each}
  <ListboxButton as="fragment" let:isOpen let:button>
    <button data-testid="listbox-button" use:button>
      <span data-testid="binding-open-button">{isOpen}</span>
    </button>
  </ListboxButton>
  {#if isShowingPanel}
    <ListboxOptions as="fragment" let:panel>
      <ul data-testid="listbox-options" use:panel>
        <ListboxOption as="fragment" value="Eren Jeager" let:option let:isActive let:isSelected>
          <li data-testid="listbox-option" use:option {disabled}>
            <span data-testid="option-value">Eren Jeager</span>
            <span data-testid="binding-active">{isActive}</span>
            <span data-testid="binding-selected">{isSelected}</span>
          </li>
        </ListboxOption>
        <ListboxOption as="fragment" value="Ichigo Kurosaki" let:option let:isActive let:isSelected>
          <li data-testid="listbox-option" use:option>
            <span data-testid="option-value">Ichigo Kurosaki</span>
            <span data-testid="binding-active">{isActive}</span>
            <span data-testid="binding-selected">{isSelected}</span>
          </li>
        </ListboxOption>
        <ListboxOption as="fragment" value="Light Yagami" let:option let:isActive let:isSelected>
          <li data-testid="listbox-option" use:option {disabled}>
            <span data-testid="option-value">Light Yagami</span>
            <span data-testid="binding-active">{isActive}</span>
            <span data-testid="binding-selected">{isSelected}</span>
          </li>
        </ListboxOption>
        <ListboxOption as="fragment" value="Naruto Uzumaki" let:option let:isActive let:isSelected>
          <li data-testid="listbox-option" use:option>
            <span data-testid="option-value">Naruto Uzumaki</span>
            <span data-testid="binding-active">{isActive}</span>
            <span data-testid="binding-selected">{isSelected}</span>
          </li>
        </ListboxOption>
        <ListboxOption as="fragment" value="Vincent Law" let:option let:isActive let:isSelected>
          <li data-testid="listbox-option" use:option {disabled}>
            <span data-testid="option-value">Vincent Law</span>
            <span data-testid="binding-active">{isActive}</span>
            <span data-testid="binding-selected">{isSelected}</span>
          </li>
        </ListboxOption>
      </ul>
    </ListboxOptions>
  {/if}
</Listbox>
