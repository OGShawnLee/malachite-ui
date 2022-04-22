<script lang="ts">
	import { Disclosure, DisclosureButton, DisclosurePanel } from '$lib/components';
	export let disabled: Nullable<boolean> = undefined;
</script>

<Disclosure open>
	<DisclosureButton bind:disabled as="slot" let:button>
		<button use:button> Button </button>
		<!-- button should be disabled -->
	</DisclosureButton>
	<DisclosurePanel as="slot" let:isDisabled let:panel>
		<span data-testid="panel-disabled">
			{isDisabled}
		</span>
		<div disabled use:panel>Panel</div>
	</DisclosurePanel>
</Disclosure>
