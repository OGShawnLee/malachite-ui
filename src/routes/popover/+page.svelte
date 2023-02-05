<script>
  import { Page } from '@app/layout';
  import { Toggle } from '@app/components';
  import { Popover, PopoverButton, PopoverGroup, PopoverOverlay, PopoverPanel } from '$lib';
  import { fade, fly, scale, slide } from 'svelte/transition';

  let forceFocus = true;

</script>

<Page title="Popover">
  <div class="flex items-center gap-3" slot="options">
    <Toggle text="Toggle Force Focus" bind:checked={forceFocus} />
  </div>
  <div class="grid grid-cols-4 items-start gap-6">
    <Popover class="grid gap-6" let:close>
      <PopoverButton class="button button--medium">Toggle</PopoverButton>
      <div slot="panel" transition:fade>
        <PopoverPanel class="panel" static>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio nulla id totam vel
            tenetur. Molestiae quo pariatur dolore distinctio dolores.
          </p>
          <button class="button button--small" on:click={close}> Close </button>
        </PopoverPanel>
      </div>
    </Popover>
    <Popover class="grid gap-6" let:close>
      <PopoverButton class="button button--medium">Toggle</PopoverButton>
      <div slot="panel" transition:fly={{ y: 25 }}>
        <PopoverPanel class="panel" static>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio nulla id totam vel
            tenetur. Molestiae quo pariatur dolore distinctio dolores.
          </p>
          <button class="button button--small" on:click={close}> Close </button>
        </PopoverPanel>
      </div>
    </Popover>
    <Popover class="grid gap-6" {forceFocus} let:close let:overlay>
      <PopoverButton class="button button--medium">Toggle</PopoverButton>
      <div class="overlay" slot="overlay" use:overlay transition:fade />
      <div class="panel--modal" slot="panel" transition:scale={{ start: 1.15 }}>
        <PopoverPanel class="p-8 | grid gap-3 | bg-neutral-800" static>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio nulla id totam vel
            tenetur. Molestiae quo pariatur dolore distinctio dolores.
          </p>
          <button class="button button--small" on:click={close}> Close </button>
        </PopoverPanel>
      </div>
    </Popover>
    <Popover class="grid gap-6" {forceFocus} let:close let:overlay>
      <PopoverButton class="button button--medium">Toggle</PopoverButton>
      <div class="overlay" slot="overlay" use:overlay transition:fade />
      <div class="panel--modal" slot="panel" transition:slide>
        <PopoverPanel class="p-8 | grid gap-3 | bg-neutral-800" static>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio nulla id totam vel
            tenetur. Molestiae quo pariatur dolore distinctio dolores.
          </p>
          <button class="button button--small" on:click={close}> Close </button>
        </PopoverPanel>
      </div>
    </Popover>
  </div>
  <PopoverGroup class="grid gap-3" let:isOpen>
    <h2 class="font-semibold text-xl text-neutral-100">Popover Group</h2>
    <output class="mb-6 | max-w-fit px-6 py-2 | bg-neutral-800">
      Group State: {isOpen ? 'Open' : 'Closed'}
    </output>
    <div class="grid grid-cols-4 items-start gap-6">
      <Popover class="grid gap-6" let:close>
        <PopoverButton class="button button--medium">Toggle</PopoverButton>
        <div slot="panel" transition:fade>
          <PopoverPanel class="panel" static>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio nulla id totam vel
              tenetur. Molestiae quo pariatur dolore distinctio dolores.
            </p>
            <button class="button button--small" on:click={close}> Close </button>
          </PopoverPanel>
        </div>
      </Popover>
      <Popover class="grid gap-6" let:close>
        <PopoverButton class="button button--medium">Toggle</PopoverButton>
        <div slot="panel" transition:fade>
          <PopoverPanel class="panel" static>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio nulla id totam vel
              tenetur. Molestiae quo pariatur dolore distinctio dolores.
            </p>
            <button class="button button--small" on:click={close}> Close </button>
          </PopoverPanel>
        </div>
      </Popover>
      <Popover class="flex flex-col gap-4.5" {forceFocus} let:close>
        <PopoverButton class="button button--medium">Toggle</PopoverButton>
        <PopoverOverlay class="overlay" />
        <PopoverPanel class="panel panel--modal">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio nulla id totam vel
            tenetur. Molestiae quo pariatur dolore distinctio dolores.
          </p>
          <div class="flex gap-3">
            <button class="button button--small" on:click={close}> Accept </button>
            <button class="button button--small" on:click={close}> Close </button>
          </div>
        </PopoverPanel>
      </Popover>
      <Popover class="flex flex-col gap-4.5" {forceFocus} let:close let:overlay>
        <PopoverButton class="button button--medium">Toggle</PopoverButton>
        <div class="overlay" slot="overlay" use:overlay transition:fade />
        <div slot="panel" transition:fade>
          <PopoverPanel class="panel panel--modal" static>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio nulla id totam vel
              tenetur. Molestiae quo pariatur dolore distinctio dolores.
            </p>
            <button class="button button--small" on:click={close}> Close </button>
          </PopoverPanel>
        </div>
      </Popover>
    </div>
  </PopoverGroup>
</Page>
