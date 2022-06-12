import type { ActionComponent } from '$lib/types';
import { type Readable, readable } from 'svelte/store';
import { GroupContext } from './Group.state';
import { defineActionComponent, initIndexGenerator } from '$lib/core';
import { Bridge, Toggleable } from '$lib/stores';
import {
	handleClickOutside,
	handleEscapeKey,
	handleFocusLeave,
	usePreventInternalFocus
} from '$lib/stores/toggleable';
import { generate, makeReadable } from '$lib/utils';
import { useComponentNaming, useContext, useListener } from '$lib/hooks';
import { isActionComponent, isFunction, isInterface, isStore } from '$lib/predicate';

interface Options {
	ForceFocus: Readable<boolean>;
}

export interface Context {
	Open: Readable<boolean>;
	ShowOverlay: Readable<boolean>;
	button: ActionComponent;
	overlay: ActionComponent;
	panel: ActionComponent;
	close: Toggleable['close'];
}

const generateIndex = initIndexGenerator();

export function createPopover({ ForceFocus }: Options) {
	const ShowOverlay = readable(true, (set) => {
		if (!hasGroupContext) return;
		return groupClient.Mode.subscribe((mode) => set(mode === 'UNIQUE'));
	});
	const Open = new Toggleable({ ForceFocus });
	const [Button, Overlay, Panel] = generate(3, () => new Bridge());
	const { nameChild } = useComponentNaming({ component: 'popover', index: generateIndex() });

	const groupClient = GroupContext.getContext(false)?.initClient(Open);
	const hasGroupContext = !!groupClient;

	setContext({
		ShowOverlay,
		Open: makeReadable(Open),
		button: createButton(),
		overlay: createOverlay(),
		panel: createPanel(),
		close: Open.close.bind(Open)
	});

	function createButton() {
		return defineActionComponent({
			onMount: nameChild('button'),
			Bridge: Button,
			destroy: ({ element }) => [
				Open.button(element, {
					onChange: (isOpen) => {
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
			destroy: ({ element }) => useListener(element, 'click', () => Open.close())
		});
	}

	function createPanel() {
		return defineActionComponent({
			Bridge: Panel,
			onMount: nameChild('panel'),
			destroy: ({ element }) => [
				Open.panel(element, {
					plugins: [usePreventInternalFocus],
					handlers: hasGroupContext ? [] : [handleClickOutside, handleEscapeKey, handleFocusLeave]
				}),
				groupClient?.panel(element)
			]
		});
	}

	return {
		ShowOverlay,
		Open: makeReadable(Open),
		button: createButton(),
		overlay: createOverlay(),
		panel: createPanel(),
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
			panel: isActionComponent,
			overlay: isActionComponent,
			close: isFunction
		})
});

export { getContext };
