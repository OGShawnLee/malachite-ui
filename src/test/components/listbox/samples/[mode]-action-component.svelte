<script lang="ts">
  import type { Maybe } from '$lib/types';
  import { Listbox, ListboxLabel, ListboxOption } from '$lib';
  import { useRange } from '@test-utils';

  export let amount = useRange(1);
  export let disabled: Maybe<boolean> = undefined;
  export let horizontal: Maybe<boolean> = undefined;
  export let infinite: Maybe<boolean> = undefined;
  export let isShowingPanel = true;
  export let value = 'Vincent Law';
</script>

<span data-testid="binding-value-global">{value}</span>
<Listbox {horizontal} {infinite} bind:value let:isOpen let:button let:options let:value>
  <span data-testid="binding-value-listbox">{value}</span>
  <span data-testid="binding-open-listbox">{isOpen}</span>
  {#each $amount as index (index)}
    <ListboxLabel data-testid="listbox-label" let:isOpen>
      <span data-testid="binding-open-label">{isOpen}</span>
    </ListboxLabel>
  {/each}
  <button data-testid="listbox-button" use:button>
    <span data-testid="binding-open-button">{isOpen}</span>
  </button>
  <svelte:fragment slot="options">
    {#if isShowingPanel}
      <ul data-testid="listbox-options" use:options>
        <ListboxOption
          data-testid="listbox-option"
          value="Eren Jeager"
          {disabled}
          let:isActive
          let:isSelected
          let:isDisabled
        >
          <span data-testid="option-value">Eren Jeager</span>
          <span data-testid="binding-active">{isActive}</span>
          <span data-testid="binding-disabled">{isDisabled}</span>
          <span data-testid="binding-selected">{isSelected}</span>
        </ListboxOption>
        <ListboxOption
          data-testid="listbox-option"
          value="Ichigo Kurosaki"
          let:isActive
          let:isSelected
          let:isDisabled
        >
          <span data-testid="option-value">Ichigo Kurosaki</span>
          <span data-testid="binding-active">{isActive}</span>
          <span data-testid="binding-disabled">{isDisabled}</span>
          <span data-testid="binding-selected">{isSelected}</span>
        </ListboxOption>
        <ListboxOption
          data-testid="listbox-option"
          value="Light Yagami"
          {disabled}
          let:isActive
          let:isSelected
          let:isDisabled
        >
          <span data-testid="option-value">Light Yagami</span>
          <span data-testid="binding-active">{isActive}</span>
          <span data-testid="binding-disabled">{isDisabled}</span>
          <span data-testid="binding-selected">{isSelected}</span>
        </ListboxOption>
        <ListboxOption
          data-testid="listbox-option"
          value="Naruto Uzumaki"
          let:isActive
          let:isSelected
          let:isDisabled
        >
          <span data-testid="option-value">Naruto Uzumaki</span>
          <span data-testid="binding-active">{isActive}</span>
          <span data-testid="binding-disabled">{isDisabled}</span>
          <span data-testid="binding-selected">{isSelected}</span>
        </ListboxOption>
        <ListboxOption
          data-testid="listbox-option"
          value="Vincent Law"
          {disabled}
          let:isActive
          let:isSelected
          let:isDisabled
        >
          <span data-testid="option-value">Vincent Law</span>
          <span data-testid="binding-active">{isActive}</span>
          <span data-testid="binding-disabled">{isDisabled}</span>
          <span data-testid="binding-selected">{isSelected}</span>
        </ListboxOption>
      </ul>
    {/if}
  </svelte:fragment>
</Listbox>
