<script>
  import { Page } from '@app/layout';
  import { Toggle } from '@app/components';
  import { Disclosure, DisclosureButton, DisclosurePanel } from '$lib';
  import { fade, fly, scale, slide } from 'svelte/transition';

  const transitions = [[fade], [fly, { y: -15 }], [scale, { start: 1.1 }], [slide]];

  let open = false;
</script>

<Page title="Disclosure">
  <div class="flex gap-6" slot="options">
    <Toggle bind:checked={open} />
  </div>
  <div class="grid grid-cols-4 gap-6">
    {#each transitions as [transition, params]}
      <Disclosure class="grid items-start gap-3" let:close {open}>
        <DisclosureButton class="button button--medium">Toggle</DisclosureButton>
        <div slot="panel" transition:transition|local={params}>
          <DisclosurePanel class="p-8 | grid gap-4.5 | bg-neutral-800 shadow-lg" static>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium eaque dolore
              voluptatem! Explicabo, ratione amet dolores odit dolore quidem voluptatem?
            </p>
            <button class="button button--small" on:click={close}> Close </button>
          </DisclosurePanel>
        </div>
      </Disclosure>
    {/each}
  </div>
</Page>
