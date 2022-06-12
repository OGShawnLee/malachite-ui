import type { Readable } from 'svelte/store';
import type { ActionComponent, Store } from '$lib/types';
import { defineActionComponent, initIndexGenerator } from '$lib/core';
import { Bridge, Toggleable, usePreventInternalFocus } from '$lib/stores';
import { generate, makeReadable } from '$lib/utils';
import { useComponentNaming, useContext } from '$lib/hooks';
import { isActionComponent, isFunction, isInterface, isStore } from '$lib/predicate';

interface Options {
	Open: Store<boolean>;
}

export interface Context {
	Open: Readable<boolean>;
	button: ActionComponent;
	panel: ActionComponent;
	close: Toggleable['close'];
}

const generateIndex = initIndexGenerator();

export function createDisclosure({ Open: isOpen }: Options) {
	const Open = new Toggleable({ Open: isOpen });
	const [Button, Panel] = generate(2, () => new Bridge());
	const { nameChild } = useComponentNaming({ component: 'disclosure', index: generateIndex() });

	setContext({
		Open: makeReadable(Open),
		button: createButton(),
		panel: createPanel(),
		close: Open.close.bind(Open)
	});

	function createButton() {
		return defineActionComponent({
			Bridge: Button,
			onMount: nameChild('button'),
			destroy: ({ element }) => [
				Open.button(element, {
					onChange: (isOpen) => {
						element.ariaExpanded = String(isOpen);
					}
				}),
				Panel.Name.subscribe((id) => {
					if (id) element.setAttribute('aria-controls', id);
					else element.removeAttribute('aria-controls');
				})
			]
		});
	}

	function createPanel() {
		return defineActionComponent({
			Bridge: Panel,
			onMount: nameChild('panel'),
			destroy: ({ element }) =>
				Open.panel(element, {
					plugins: [usePreventInternalFocus]
				})
		});
	}

	return {
		Open: makeReadable(Open),
		button: createButton(),
		panel: createPanel(),
		sync: Open.sync,
		close: Open.close.bind(Open),
		getContext: getContext
	};
}

const { setContext, getContext } = useContext({
	component: 'disclosure',
	predicate: (val): val is Context =>
		isInterface<Context>(val, {
			Open: isStore,
			button: isActionComponent,
			panel: isActionComponent,
			close: isFunction
		})
});

export { getContext };
