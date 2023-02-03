<script lang="ts">
  import { Switch } from '$lib';
  import { useClassNameResolver } from '$lib/hooks';

  export let checked = false;
  export let text = 'Toggle';

  $: className = useClassNameResolver<'CHECKED'>({
    base: 'button button--medium',
    checked: 'bg-neutral-700 text-white'
  })({ isChecked: checked });
</script>

<Switch class={className} bind:checked>
  <slot>{text}</slot>
</Switch>
