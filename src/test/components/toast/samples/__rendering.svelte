<script lang="ts">
  import type { Action, RenderElementTagName } from '$lib/types';
  import { ToastGroup, Toast, useToast } from '$lib/components';

  interface ComponentConfig {
    as?: RenderElementTagName;
    use?: Action[];
    rest?: {};
  }

  export let toast: ComponentConfig = {};

  const manager = useToast();

  manager.push({ message: 'CHVRN - Never Know', type: 'info' });
</script>

<ToastGroup data-testid="toast-group" toast={manager}>
  {#each $manager as { id }}
    <Toast as={toast?.as} use={toast?.use} {...toast?.rest} data-testid="toast" {id} />
  {/each}
</ToastGroup>
