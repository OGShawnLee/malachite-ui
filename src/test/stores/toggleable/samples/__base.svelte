<script lang="ts">
	import type { Toggleable } from '$lib/stores';
	export let Open: Toggleable;
	function button(element: HTMLElement) {
		return { destroy: Open.button(element) };
	}
	function panel(element: HTMLElement) {
		return { destroy: Open.panel(element) };
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
