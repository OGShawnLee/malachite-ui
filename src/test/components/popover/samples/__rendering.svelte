<script lang="ts">
  import type { Action, RenderElementTagName } from '$lib/types';
  import { Popover, PopoverButton, PopoverOverlay, PopoverPanel } from '$lib/components';

  interface ComponentConfig {
    as?: RenderElementTagName;
    use?: Action[];
    rest?: {};
  }

  export let button: ComponentConfig = {};
  export let overlay: ComponentConfig = {};
  export let panel: ComponentConfig = {};
  export let popover: ComponentConfig = {};
</script>

<Popover as={popover?.as} use={popover?.use} {...popover?.rest} data-testid="popover-root">
  <PopoverOverlay
    as={overlay?.as}
    use={overlay?.use}
    {...overlay?.rest}
    data-testid="popover-overlay"
  />
  <PopoverButton as={button?.as} use={button?.use} {...button?.rest} data-testid="popover-button">
    Button
  </PopoverButton>
  <PopoverPanel
    as={panel?.as}
    use={panel?.use}
    {...panel?.rest}
    data-testid="popover-panel"
    let:close
  >
    <button on:click={close}> Close Me </button>
  </PopoverPanel>
</Popover>
