<script lang="ts">
	import Dialog from './state';
	import { Render, Portal } from '@components';
	import type { Readable, Writable } from 'svelte/store';
	import type { Forwarder } from '$lib/types';
	import { storable } from '@stores';
	import { isNotStore } from '@predicate';

	export let open: Writable<boolean> | boolean = false;
	export let initialFocus: Readable<Nullable<HTMLElement>> | Nullable<HTMLElement> = undefined;

	const InitialFocus = storable({ Store: initialFocus, initialValue: undefined });
	$: InitialFocus.sync({ previous: $InitialFocus, value: initialFocus });

	const State = new Dialog({
		Store: open,
		initialValue: false,
		notifier: (newValue) => isNotStore(open) && (open = newValue),
		initialFocus: $InitialFocus
	});

	const { overlay, dialog, content, title, description, close } = State;

	$: State.sync({ previous: $State, value: open });
	$: State.initialFocus = $InitialFocus;

	let className: Nullable<string> = undefined;

	export { className as class };
	export let as: RenderElementTagName = 'div';
	export let element: HTMLElement | undefined = undefined;
	export let use: Expand<Forwarder.Actions> = [];

	let finalUse: Forwarder.Actions;
	$: finalUse = [...use, [dialog.action]];
</script>

{#if $State}
	<Portal id="malachite-portal-root">
		<Render {as} bind:element class={className} {...$$restProps} use={finalUse}>
			<slot
				overlay={overlay.action}
				dialog={dialog.action}
				content={content.action}
				title={title.action}
				description={description.action}
				{close}
			/>
		</Render>
	</Portal>
{/if}
