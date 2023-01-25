import type { ActionComponent, ExtractContextKeys } from '$lib/types';
import type { Readable } from 'svelte/store';
import { GroupContext } from './Group.state';
import { defineActionComponent, initIndexGenerator } from '$lib/core';
import { Bridge, Toggleable } from '$lib/stores';
import {
	handleClickOutside,
	handleEscapeKey,
	handleFocusLeave,
	usePreventInternalFocus
} from '$lib/plugins';
import { createStoreWrapper, generate, makeReadable } from '$lib/utils';
import { useComponentNaming, useContext, useListener } from '$lib/hooks';
import { isActionComponent, isFunction, isInterface, isStore } from '$lib/predicate';
import { readable } from 'svelte/store';

interface Configuration {
	ForceFocus: Readable<boolean> | boolean;
}

interface Context {
	Open: Readable<boolean>;
	ShowOverlay: Readable<boolean>;
	button: ActionComponent;
	overlay: ActionComponent;
	panel: ActionComponent;
	close: Toggleable['close'];
}

export type ContextKeys = ExtractContextKeys<Context>;

const generateIndex = initIndexGenerator();

export function createPopover({ ForceFocus: uForceFocus }: Configuration) {
	const ForceFocus = createStoreWrapper({ Store: uForceFocus, initialValue: false });
	const Open = new Toggleable({ ForceFocus });
	const ShowOverlay = readable(true, (set) =>
		groupClient?.Mode.subscribe((mode) => set(mode === 'UNIQUE'))
	);
	const { nameChild } = useComponentNaming({ name: 'popover', index: generateIndex() });
	const [Button, Overlay, Panel] = generate(3, () => new Bridge());

	const groupClient = GroupContext.getContext(false)?.initClient(Open);

	function createButton() {
		return defineActionComponent({
			Bridge: Button,
			onMount: nameChild('button'),
			destroy: ({ element }) => [
				Open.button(element, {
					onChange(isOpen) {
						element.ariaExpanded = String(isOpen);
					}
				}),
				Panel.Name.subscribe((id) => {
					if (id) element.setAttribute('aria-controls', id);
					else element.removeAttribute('aria-controls');
				}),
				groupClient?.button(element)
			]
		});
	}

	function createOverlay() {
		return defineActionComponent({
			Bridge: Overlay,
			onMount: nameChild('overlay'),
			destroy: ({ element }) =>
				useListener(element, 'click', (event) => {
					if (event.target === element) Open.close();
				})
		});
	}

	function createPanel() {
		return defineActionComponent({
			Bridge: Panel,
			onMount: nameChild('panel'),
			destroy: ({ element }) => [
				Open.panel(element, {
					plugins: [usePreventInternalFocus],
					handlers: groupClient ? [] : [handleClickOutside, handleEscapeKey, handleFocusLeave]
				}),
				groupClient?.panel(element)
			]
		});
	}

	setContext({
		Open: makeReadable(Open),
		ShowOverlay: ShowOverlay,
		button: createButton(),
		panel: createPanel(),
		overlay: createOverlay(),
		close: Open.close.bind(Open)
	});

	return {
		Open: makeReadable(Open),
		ForceFocus: ForceFocus,
		ShowOverlay: ShowOverlay,
		button: createButton(),
		panel: createPanel(),
		overlay: createOverlay(),
		close: Open.close.bind(Open)
	};
}

const { getContext, setContext } = useContext({
	component: 'popover',
	predicate: (val): val is Context =>
		isInterface<Context>(val, {
			Open: isStore,
			ShowOverlay: isStore,
			button: isActionComponent,
			overlay: isActionComponent,
			panel: isActionComponent,
			close: isFunction
		})
});

export { getContext };
