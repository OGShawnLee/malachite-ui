<script lang="ts">
  import type { Action, RenderElementTagName } from '$lib/types';
  import { RadioGroup, RadioGroupDescription, RadioGroupLabel, RadioGroupOption } from '$lib';

  interface ComponentConfig {
    as?: RenderElementTagName;
    use?: Action[];
    rest?: {};
  }

  export let description: ComponentConfig = {};
  export let label: ComponentConfig = {};
  export let option: ComponentConfig = {};
</script>

<RadioGroup>
  <RadioGroupOption as={option.as} use={option.use} {...option.rest} data-testid="radio-option">
    <RadioGroupDescription
      as={description.as}
      use={description.use}
      {...description.rest}
      data-testid="radio-description"
    />
    <RadioGroupLabel as={label.as} use={label.use} {...label.rest} data-testid="radio-label" />
  </RadioGroupOption>
</RadioGroup>
