<script>
  import { Disclosure, DisclosureButton, DisclosurePanel } from '$lib/components';
  import { fade, slide } from 'svelte/transition';
</script>

<!-- WE HAVE TO USE TRANSITION:LOCAL SO THAT THE TRANSITION OUT DOES NOT PLAY WHEN LEAVING THE PAGE -->
<a href="/">Home</a>

<!-- WE CANNOT USE TRANSITIONS HERE BECAUSE SVELTE:ELEMENT DOES NOT SUPPORT TRANSITION|LOCAL -->
<Disclosure class={{ base: 'disclosure', open: 'disclosure--open' }}>
  <DisclosureButton class="disclosure__button">Toggle</DisclosureButton>
  <DisclosurePanel class="disclosure__panel" as="nav" let:close>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat, at!</p>
    <button on:click={close}> Close </button>
  </DisclosurePanel>
</Disclosure>

<!-- WE HAVE FULL CONTROL HERE  -->
<Disclosure let:button let:panel>
  <button use:button>Toggle</button>
  <div slot="panel" use:panel let:close transition:fade|local>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat, at!</p>
    <button on:click={close}> Close </button>
  </div>
</Disclosure>

<!-- WE HAVE PARCIAL CONTROL HERE: CAN USE TRANSITION AS LONG AS IT IS NOT LOCAL -->
<Disclosure>
  <DisclosureButton as="slot" let:button>
    <button use:button> Toggle </button>
  </DisclosureButton>
  <DisclosurePanel as="slot" let:panel let:close>
    <section use:panel transition:slide|local>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat, at!</p>
      <button on:click={close}> Close </button>
    </section>
  </DisclosurePanel>
</Disclosure>

<style>
  :global(.disclosure) {
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
  }

  :global(.disclosure__button) {
    border-radius: 1ex;
  }

  :global(.disclosure__panel) {
    padding: 1.75rem;
  }
</style>
