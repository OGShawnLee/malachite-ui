<script lang="ts">
	import type { Toggleable } from '$lib/stores';
	import type { Unsubscriber } from 'svelte/store';

	export let Open: Toggleable;
	export let handlers: Array<(this: Toggleable) => Unsubscriber> = [];

	function button(element: HTMLElement) {
		return { destroy: Open.button(element) };
	}
	function panel(element: HTMLElement) {
		return { destroy: Open.panel(element, { handlers }) };
	}
</script>

<button use:button> Button </button>
<button> Ref </button>
<button tabindex={-1}> Invalid Focusable Ref </button>
<button disabled> Invalid Disabled Ref </button>

{#if $Open}
	<div use:panel>
		Panel
		<button> Internal Ref </button>
	</div>
{/if}
