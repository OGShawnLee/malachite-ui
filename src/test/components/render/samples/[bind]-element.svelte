<script lang="ts">
  import type { RenderElementTagName } from '$lib/types';
  import { Render }  from '$lib';

  export let as: RenderElementTagName = 'div';
  export let func: (element: HTMLElement) => void;

  let element: HTMLElement;
  $: if (element) func(element);
</script>

<Render {as} bind:element data-testid="[bind]-element-{as}" />
