<script lang="ts">
  import type { Maybe } from '$lib/types';
  import { RadioGroup, RadioGroupDescription, RadioGroupLabel, RadioGroupOption } from '$lib';
  import { useRange } from '@test-utils';

  export let amount = useRange(3);
  export let disabled: Maybe<boolean> = undefined;
  export let horizontal: Maybe<boolean> = undefined;
  export let value = 'Vincent Law';
</script>

<span data-testid="binding-value-global">{value}</span>
<RadioGroup as="fragment" bind:value {horizontal} let:radiogroup let:value>
  <div data-testid="radio" use:radiogroup>
    <span data-testid="binding-value-group">{value}</span>
    {#each $amount as index (index)}
      <RadioGroupLabel as="fragment" let:label>
        <label data-testid="radio-label-group" use:label />
      </RadioGroupLabel>
      <RadioGroupDescription as="fragment" let:description>
        <span data-testid="radio-description-group" use:description />
      </RadioGroupDescription>
    {/each}
    <RadioGroupOption as="fragment" value="Eren Jeager" let:isSelected let:option>
      <div data-testid="radio-option" {disabled} use:option>
        <span data-testid="option-value"> Eren Jeager </span>
        <span data-testid="binding-selected">{isSelected}</span>
        {#each $amount as index (index)}
          <RadioGroupLabel as="fragment" let:label>
            <label data-testid="radio-label-option" use:label />
          </RadioGroupLabel>
          <RadioGroupDescription as="fragment" let:description>
            <span data-testid="radio-description-option" use:description />
          </RadioGroupDescription>
        {/each}
      </div>
    </RadioGroupOption>
    <RadioGroupOption as="fragment" value="Ichigo Kurosaki" let:isSelected let:option>
      <div data-testid="radio-option" use:option>
        <span data-testid="option-value"> Ichigo Kurosaki </span>
        <span data-testid="binding-selected">{isSelected}</span>
        {#each $amount as index (index)}
          <RadioGroupLabel as="fragment" let:label>
            <label data-testid="radio-label-option" use:label />
          </RadioGroupLabel>
          <RadioGroupDescription as="fragment" let:description>
            <span data-testid="radio-description-option" use:description />
          </RadioGroupDescription>
        {/each}
      </div>
    </RadioGroupOption>
    <RadioGroupOption as="fragment" value="Light Yagami" let:isSelected let:option>
      <div data-testid="radio-option" {disabled} use:option>
        <span data-testid="option-value"> Light Yagami </span>
        <span data-testid="binding-selected">{isSelected}</span>
        {#each $amount as index (index)}
          <RadioGroupLabel as="fragment" let:label>
            <label data-testid="radio-label-option" use:label />
          </RadioGroupLabel>
          <RadioGroupDescription as="fragment" let:description>
            <span data-testid="radio-description-option" use:description />
          </RadioGroupDescription>
        {/each}
      </div>
    </RadioGroupOption>
    <RadioGroupOption as="fragment" value="Naruto Uzumaki" let:isSelected let:option>
      <div data-testid="radio-option" use:option>
        <span data-testid="option-value"> Naruto Uzumaki </span>
        <span data-testid="binding-selected">{isSelected}</span>
        {#each $amount as index (index)}
          <RadioGroupLabel as="fragment" let:label>
            <label data-testid="radio-label-option" use:label />
          </RadioGroupLabel>
          <RadioGroupDescription as="fragment" let:description>
            <span data-testid="radio-description-option" use:description />
          </RadioGroupDescription>
        {/each}
      </div>
    </RadioGroupOption>
    <RadioGroupOption as="fragment" value="Vincent Law" let:isSelected let:option>
      <span data-testid="option-value"> Vincent Law </span>
      <div data-testid="radio-option" {disabled} use:option>
        <span data-testid="binding-selected">{isSelected}</span>
        {#each $amount as index (index)}
          <RadioGroupLabel as="fragment" let:label>
            <label data-testid="radio-label-option" use:label />
          </RadioGroupLabel>
          <RadioGroupDescription as="fragment" let:description>
            <span data-testid="radio-description-option" use:description />
          </RadioGroupDescription>
        {/each}
      </div>
    </RadioGroupOption>
  </div>
</RadioGroup>
