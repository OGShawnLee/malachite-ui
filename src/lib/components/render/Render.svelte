<script lang="ts">
  import type { Expand, Forwarder, Nullable, RenderElementTagName } from '$lib/types';
  import { forwardActions } from '$lib/core';
  import { Bridge } from '$lib/stores';
  import { onMount } from 'svelte';
  import { isVoidTagName } from '$lib/predicate';

  let className: Nullable<string> = undefined;

  export { className as class };
  export let as: RenderElementTagName = 'slot';
  export let disabled: Nullable<boolean> = undefined;
  export let element: HTMLElement | null = null;
  export let use: Expand<Forwarder.Actions> = [];

  export let Proxy: Bridge = new Bridge();

  const { Disabled } = Proxy;

  $: isVoidElement = isVoidTagName(as);
  $: isUsingSlot = as === 'slot';
  $: if (isUsingSlot && element) {
    if (className) element.className = className;
  }

  onMount(() =>
    Disabled.subscribe((isDisabled) => {
      if (isDisabled !== disabled) disabled = isDisabled;
    })
  );

  $: Proxy.isUsingSlot = isUsingSlot;
  Proxy.onChange = (el) => (element = el);
  $: Proxy.sync({ disabled });
</script>

{#if as === 'slot'}
  <slot />
{:else if isVoidElement}
  <svelte:element
    this={as}
    bind:this={element}
    class={className}
    {disabled}
    use:forwardActions={use}
    {...$$restProps}
    on:blur
    on:click
    on:focus
  />
{:else}
  <svelte:element
    this={as}
    bind:this={element}
    class={className}
    {disabled}
    use:forwardActions={use}
    {...$$restProps}
    on:blur
    on:click
    on:focus
  >
    <slot />
  </svelte:element>
{/if}
