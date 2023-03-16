<script lang="ts" context="module">
  import type { Nullable } from '$lib/types';
  import { render as init } from '@testing-library/svelte';
  import { getContextKey } from '$lib/hooks';

  export function createContextParentRenderer<T>(
    ContextParent: typeof SvelteComponent,
    componentName: string
  ) {
    function renderContextParent(children: typeof SvelteComponent, context?: Nullable<T>) {
      return init(ContextParent, { props: { children, componentName, context } });
    }
    const errorMessages = {
      unset: `Unable to Find ${getContextKey(componentName)} Context. Did you set it?`,
      invalid: `Invalid ${getContextKey(componentName)} Context`
    };

    return [renderContextParent, errorMessages] as [
      typeof renderContextParent,
      typeof errorMessages
    ];
  }

  export function renderContextParentComponent<T>(
    Parent: typeof SvelteComponent,
    configuration: {
      children: typeof SvelteComponent;
      componentName: string;
      context?: Nullable<T>;
    }
  ) {
    const { children, componentName, context } = configuration;
    return init(Parent, { props: { children, componentName, context } });
  }
</script>

<script lang="ts">
  import type {   SvelteComponent } from 'svelte';
  import { setContext } from 'svelte';

  export let children: typeof SvelteComponent;
  export let componentName: string;
  export let context: {} | undefined = undefined;

  setContext(getContextKey(componentName), context);
</script>

<svelte:component this={children} />
