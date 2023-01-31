<script>
  import { Button } from '$lib';

  let pressed = false;
</script>

<Button
  class={{
    base: 'px-6 py-2 | bg-neutral-800 uppercase font-medium',
    pressed: 'bg-white text-black'
  }}
  bind:pressed
>
  Toggle
</Button>
