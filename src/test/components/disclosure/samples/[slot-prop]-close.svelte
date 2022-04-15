<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { Disclosure, DisclosurePanel } from '@components';

	export let open: Writable<boolean> | boolean | undefined = undefined;
	export let receiveClose: (close: (ref?: Event | HTMLElement) => void) => void = () => {};

	function buttonAction(
		element: HTMLElement,
		[action, close]: [
			action: (element: HTMLElement) => {},
			close: (ref?: Event | HTMLElement) => void
		]
	) {
		receiveClose(close);
		return action(element);
	}

	function panelAction(
		element: HTMLElement,
		[action, close]: [
			action: (element: HTMLElement) => {},
			close: (ref?: Event | HTMLElement) => void
		]
	) {
		receiveClose(close);
		return action(element);
	}
</script>

<button> Ref </button>

<Disclosure {open} let:button let:close>
	<button use:buttonAction={[button, close]}> Close Button </button>
	<DisclosurePanel as="slot" let:panel let:close>
		<div use:panelAction={[panel, close]}>
			Close Panel
			<button on:click={close}> Close Me </button>
		</div>
	</DisclosurePanel>
</Disclosure>
