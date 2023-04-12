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
<RadioGroup data-testid="radio" bind:value {horizontal} let:value>
  <span data-testid="binding-value-group">{value}</span>
  {#each $amount as index (index)}
    <RadioGroupLabel data-testid="radio-label-group" />
    <RadioGroupDescription data-testid="radio-description-group" />
  {/each}
  <RadioGroupOption data-testid="radio-option" value="Eren Jeager" {disabled} let:isSelected>
    <span data-testid="option-value"> Eren Jeager </span>
    <span data-testid="binding-selected">{isSelected}</span>
    {#each $amount as index (index)}
      <RadioGroupLabel data-testid="radio-label-option" />
      <RadioGroupDescription data-testid="radio-description-option" />
    {/each}
  </RadioGroupOption>
  <RadioGroupOption data-testid="radio-option" value="Ichigo Kurosaki" let:isSelected>
    <span data-testid="option-value"> Ichigo Kurosaki </span>
    <span data-testid="binding-selected">{isSelected}</span>
    {#each $amount as index (index)}
      <RadioGroupLabel data-testid="radio-label-option" />
      <RadioGroupDescription data-testid="radio-description-option" />
    {/each}
  </RadioGroupOption>
  <RadioGroupOption data-testid="radio-option" value="Light Yagami" {disabled} let:isSelected>
    <span data-testid="option-value"> Light Yagami </span>
    <span data-testid="binding-selected">{isSelected}</span>
    {#each $amount as index (index)}
      <RadioGroupLabel data-testid="radio-label-option" />
      <RadioGroupDescription data-testid="radio-description-option" />
    {/each}
  </RadioGroupOption>
  <RadioGroupOption data-testid="radio-option" value="Naruto Uzumaki" let:isSelected>
    <span data-testid="option-value"> Naruto Uzumaki </span>
    <span data-testid="binding-selected">{isSelected}</span>
    {#each $amount as index (index)}
      <RadioGroupLabel data-testid="radio-label-option" />
      <RadioGroupDescription data-testid="radio-description-option" />
    {/each}
  </RadioGroupOption>
  <RadioGroupOption data-testid="radio-option" value="Vincent Law" {disabled} let:isSelected>
    <span data-testid="option-value"> Vincent Law </span>
    <span data-testid="binding-selected">{isSelected}</span>
    {#each $amount as index (index)}
      <RadioGroupLabel data-testid="radio-label-option" />
      <RadioGroupDescription data-testid="radio-description-option" />
    {/each}
  </RadioGroupOption>
</RadioGroup>
