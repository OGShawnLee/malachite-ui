<script lang="ts">
	import { Disclosure, DisclosureButton, DisclosurePanel } from '@components';

	export let buttonAction: (element: HTMLElement, action: (element: HTMLElement) => {}) => {};
	export let panelAction: (element: HTMLElement, action: (element: HTMLElement) => {}) => {};

	export let target: 'GLOBAL' | 'LOCAL';
</script>

{#if target === 'GLOBAL'}
	<Disclosure open let:button let:panel>
		<button use:buttonAction={button}> Action Button </button>
		<div slot="panel" use:panelAction={panel}>Action Panel</div>
	</Disclosure>
{:else if target === 'LOCAL'}
	<Disclosure open>
		<DisclosureButton as="slot" let:button>
			<button use:buttonAction={button}> Action Button </button>
		</DisclosureButton>
		<DisclosurePanel as="slot" let:panel>
			<div use:panelAction={panel}>Action Panel</div>
		</DisclosurePanel>
	</Disclosure>
{/if}
