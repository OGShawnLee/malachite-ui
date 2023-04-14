<script lang="ts">
  import type { Action, RenderElementTagName } from '$lib/types';
  import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '$lib';

  interface ComponentConfig {
    as?: RenderElementTagName;
    use?: Action[];
    rest?: {};
  }

  export let button: ComponentConfig = {};
  export let options: ComponentConfig = {};
  export let option: ComponentConfig = {};
  export let label: ComponentConfig = {};
  export let listbox: ComponentConfig = {};
</script>

<Listbox data-testid="listbox" as={listbox.as} use={listbox.use} {...listbox.rest}>
  <ListboxLabel data-testid="listbox-label" as={label.as} use={label.use} {...label.rest} />
  <ListboxButton data-testid="listbox-button" as={button.as} use={button.use} {...button.rest} />
  <ListboxOptions data-testid="listbox-options" as={options.as} use={options.use} {...options.rest}>
    <ListboxOption data-testid="listbox-option" as={option.as} use={option.use} {...option.rest} />
  </ListboxOptions>
</Listbox>
