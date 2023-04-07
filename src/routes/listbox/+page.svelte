<script lang="ts">
  import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '$lib';
  import { Page } from '@app/layout';
  import { Toggle } from '@app/components';
  import { fade, fly, scale, slide } from 'svelte/transition';
  import { quartOut } from 'svelte/easing';
  import { useClassNameResolver } from '$lib/hooks';

  const className = useClassNameResolver<'ACTIVE' | 'DISABLED' | 'SELECTED'>({
    base: 'w-54 pl-8 pr-4 py-2 | flex items-center justify-between | cursor-pointer',
    active: 'bg-neutral-700',
    disabled: 'opacity-50',
    selected: 'text-white font-medium'
  });

  let infinite = false;
  let horizontal = false;
  let nofocus = false;
</script>

<Page title="Listbox">
  <div class="flex items-center gap-3" slot="options">
    <Toggle text="Toggle Infinite" bind:checked={infinite} />
    <Toggle text="Toggle Horizontal" bind:checked={horizontal} />
    <Toggle bind:checked={nofocus} text="Toggle Button onClose Focus"/>
  </div>
  <div class="grid grid-cols-4 gap-9">
    <Listbox class="relative" value="John Cena" let:value {infinite} {horizontal}>
      <ListboxLabel class="sr-only">Select your Warrior</ListboxLabel>
      <ListboxButton class="button button--medium" {nofocus}>{value}</ListboxButton>
      <div class="absolute top-15" slot="options" transition:fade|local>
        <ListboxOptions class="p-0 m-0 | bg-neutral-800 outline-none list-none" static>
          <ListboxOption class={className} value="Ricardo Milos" let:isSelected>
            <span> Ricardo Milos </span>
            {#if isSelected}
              <div class="w-5 h-5 | grid place-content-center">
                <i class="bx bxs-badge-check text-xl" />
              </div>
            {/if}
          </ListboxOption>
          <ListboxOption class={className} value="John Cena" let:isSelected>
            <span> John Cena </span>
            {#if isSelected}
              <div class="w-5 h-5 | grid place-content-center">
                <i class="bx bxs-badge-check text-xl" />
              </div>
            {/if}
          </ListboxOption>
          <ListboxOption class={className} value="The Rock" let:isSelected>
            <span> The Rock </span>
            {#if isSelected}
              <div class="w-5 h-5 | grid place-content-center">
                <i class="bx bxs-badge-check text-xl" />
              </div>
            {/if}
          </ListboxOption>
        </ListboxOptions>
      </div>
    </Listbox>
    <Listbox class="relative" let:value {infinite} {horizontal}>
      <ListboxLabel class="sr-only">Select your Warrior</ListboxLabel>
      <ListboxButton class="button button--medium" {nofocus}>{value || 'Select your Warrior'}</ListboxButton>
      <div class="absolute top-15" slot="options" transition:slide|local={{ easing: quartOut }}>
        <ListboxOptions class="p-0 m-0 | bg-neutral-800 outline-none list-none" static>
          <ListboxOption class={className} value="Ricardo Milos" let:isSelected>
            <span> Ricardo Milos </span>
            {#if isSelected}
              <div class="w-5 h-5 | grid place-content-center">
                <i class="bx bxs-badge-check text-xl" />
              </div>
            {/if}
          </ListboxOption>
          <ListboxOption class={className} value="John Cena" let:isSelected>
            <span> John Cena </span>
            {#if isSelected}
              <div class="w-5 h-5 | grid place-content-center">
                <i class="bx bxs-badge-check text-xl" />
              </div>
            {/if}
          </ListboxOption>
          <ListboxOption class={className} value="The Rock" let:isSelected>
            <span> The Rock </span>
            {#if isSelected}
              <div class="w-5 h-5 | grid place-content-center">
                <i class="bx bxs-badge-check text-xl" />
              </div>
            {/if}
          </ListboxOption>
          <ListboxOption class={className} value="Bully Maguire" let:isSelected>
            <span> Bully Maguire </span>
            {#if isSelected}
              <div class="w-5 h-5 | grid place-content-center">
                <i class="bx bxs-badge-check text-xl" />
              </div>
            {/if}
          </ListboxOption>
        </ListboxOptions>
      </div>
    </Listbox>
    <Listbox class="relative" value="Ricardo Milos" let:value {infinite} {horizontal}>
      <ListboxLabel class="sr-only">Select your Warrior</ListboxLabel>
      <ListboxButton class="button button--medium" {nofocus}>{value}</ListboxButton>
      <div
        class="absolute top-15"
        slot="options"
        transition:fly|local={{ x: 50, easing: quartOut }}
      >
        <ListboxOptions class="p-0 m-0 | bg-neutral-800 outline-none list-none" static>
          <ListboxOption class={className} value="Gigachad" let:isSelected>
            <span> Gigachad </span>
            {#if isSelected}
              <div class="w-5 h-5 | grid place-content-center">
                <i class="bx bxs-badge-check text-xl" />
              </div>
            {/if}
          </ListboxOption>
          <ListboxOption class={className} value="Ricardo Milos" let:isSelected>
            <span> Ricardo Milos </span>
            {#if isSelected}
              <div class="w-5 h-5 | grid place-content-center">
                <i class="bx bxs-badge-check text-xl" />
              </div>
            {/if}
          </ListboxOption>
          <ListboxOption class={className} value="John Cena" let:isSelected>
            <span> John Cena </span>
            {#if isSelected}
              <div class="w-5 h-5 | grid place-content-center">
                <i class="bx bxs-badge-check text-xl" />
              </div>
            {/if}
          </ListboxOption>
          <ListboxOption class={className} value="The Rock" let:isSelected>
            <span> The Rock </span>
            {#if isSelected}
              <div class="w-5 h-5 | grid place-content-center">
                <i class="bx bxs-badge-check text-xl" />
              </div>
            {/if}
          </ListboxOption>
          <ListboxOption class={className} value="Bully Maguire" disabled let:isSelected>
            <span> Bully Maguire </span>
            {#if isSelected}
              <div class="w-5 h-5 | grid place-content-center">
                <i class="bx bxs-badge-check text-xl" />
              </div>
            {/if}
          </ListboxOption>
        </ListboxOptions>
      </div>
    </Listbox>
    <Listbox class="relative" value="The Rock" let:value {infinite} {horizontal}>
      <ListboxLabel class="sr-only">Select your Warrior</ListboxLabel>
      <ListboxButton class="button button--medium" {nofocus}>{value}</ListboxButton>
      <div class="absolute top-15" slot="options" transition:scale|local={{ start: 1.125 }}>
        <ListboxOptions class="p-0 m-0 | bg-neutral-800 outline-none list-none" static>
          <ListboxOption class={className} value="Ricardo Milos" let:isSelected>
            <span> Ricardo Milos </span>
            {#if isSelected}
              <div class="w-5 h-5 | grid place-content-center">
                <i class="bx bxs-badge-check text-xl" />
              </div>
            {/if}
          </ListboxOption>
          <ListboxOption class={className} value="John Cena" let:isSelected>
            <span> John Cena </span>
            {#if isSelected}
              <div class="w-5 h-5 | grid place-content-center">
                <i class="bx bxs-badge-check text-xl" />
              </div>
            {/if}
          </ListboxOption>
          <ListboxOption class={className} value="The Rock" let:isSelected>
            <span> The Rock </span>
            {#if isSelected}
              <div class="w-5 h-5 | grid place-content-center">
                <i class="bx bxs-badge-check text-xl" />
              </div>
            {/if}
          </ListboxOption>
        </ListboxOptions>
      </div>
    </Listbox>
  </div>
</Page>
