<script lang="ts">
  import { Listbox, ListboxButton, ListboxLabel, ListboxOptions, ListboxOption } from '$lib';
  import { useClassNameResolver } from '$lib/hooks';

  let value = 'John Cena';

  const className = useClassNameResolver<'ACTIVE' | 'DISABLED' | 'SELECTED'>({
    base: 'px-6 py-2 | text-sm text-center',
    active: 'bg-light-600',
    disabled: 'opacity-50',
    selected: 'text-black font-medium'
  });
</script>

<Listbox bind:value>
  <ListboxLabel class="sr-only">Select your Warrior</ListboxLabel>
  <ListboxButton>{value}</ListboxButton>
  <ListboxOptions>
    <ListboxOption class={className} value="John Cena">John Cena</ListboxOption>
    <ListboxOption class={className} disabled value="Ricardo Milos">Ricardo Milos</ListboxOption>
    <ListboxOption class={className} value="The Rock">The Rock</ListboxOption>
  </ListboxOptions>
</Listbox>
