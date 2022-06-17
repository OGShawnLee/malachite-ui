<script>
  import { Render } from '$lib/components';

  export let handleBlur = () => {};
  export let handleClick = () => {};
  export let handleFocus = () => {};
</script>

<Render as="div" tabIndex={0} on:blur={handleBlur} on:click={handleClick} on:focus={handleFocus}>
  Render
</Render>
