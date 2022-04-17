<script lang="ts">
	import type { Toggleable } from '@stores';

	export let Open: Toggleable;
	export let options: { panel?: {} } = {};

	function button(element: HTMLElement) {
		return { destroy: Open.button(element) };
	}
	function panel(element: HTMLElement) {
		return { destroy: Open.panel(element, options.panel) };
	}
</script>

<button use:button> Button </button>

{#if $Open}
	<div use:panel>
		Panel
		<button> Internal Ref </button>
	</div>
{/if}

<button>External</button>
