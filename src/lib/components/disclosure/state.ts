import type { ActionComponent, ExtractContextKeys, WritableWrapper } from '$lib/types';
import type { Readable } from 'svelte/store';
import { defineActionComponent, initIndexGenerator } from '$lib/core';
import { useComponentNaming, useContext } from '$lib/hooks';
import { Bridge, Toggleable, usePreventInternalFocus } from '$lib/stores';
import { generate, makeReadable } from '$lib/utils';
import { isActionComponent, isFunction, isInterface, isStore } from '$lib/predicate';

interface Configuration {
	Open: WritableWrapper<boolean>;
}

interface Context {
	Open: Readable<boolean>;
	close: OmitThisParameter<Toggleable['close']>;
	button: ActionComponent;
	panel: ActionComponent;
}

export type ContextKeys = ExtractContextKeys<Context>;

const generateIndex = initIndexGenerator();

export function createDisclosure({ Open: uOpen }: Configuration) {
	const Open = new Toggleable({ Open: uOpen });
	const { nameChild } = useComponentNaming({ name: 'disclosure', index: generateIndex() });
	const [Button, Panel] = generate(2, () => new Bridge());

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
				})
			]
		});
	}

	function createPanel() {
		return defineActionComponent({
			Bridge: Panel,
			onMount: nameChild('panel'),
			destroy: ({ element }) => Open.panel(element, { plugins: [usePreventInternalFocus] })
		});
	}

	setContext({
		Open: makeReadable(Open),
		button: createButton(),
		panel: createPanel(),
		close: Open.close.bind(Open)
	});

	return {
		Open: uOpen,
		button: createButton(),
		panel: createPanel(),
		close: Open.close.bind(Open)
	};
}

const { getContext, setContext } = useContext({
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
