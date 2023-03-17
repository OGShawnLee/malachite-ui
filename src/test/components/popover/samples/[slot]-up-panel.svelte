<script>
  import { Popover, PopoverButton } from '$lib/components';
</script>

<Popover let:panel>
  <PopoverButton data-testid="popover-button">Button</PopoverButton>
  <div slot="up-panel" data-testid="popover-panel" use:panel>Panel</div>
</Popover>
