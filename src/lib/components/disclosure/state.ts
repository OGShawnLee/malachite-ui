import type { ComponentInitialiser, ExtractContextKeys, Ref } from '$lib/types';
import type { Readable } from 'svelte/store';
import { ElementBinder, defineActionComponent } from '$lib/core';
import { useComponentNaming, useContext } from '$lib/hooks';
import { Toggleable } from '$lib/stores';
import { isFunction, isInterface, isRef, isStore } from '$lib/predicate';
import { handleAriaControls, handleAriaExpanded } from '$lib/plugins';

interface Context {
	isOpen: Readable<boolean>;
	close: OmitThisParameter<Toggleable['close']>;
	createDisclosureButton: ComponentInitialiser<Readable<string | undefined>>;
	createDisclosurePanel: ComponentInitialiser;
	noButtonFocus: Ref<boolean>;
}

export type ContextKeys = ExtractContextKeys<Context>;

export function createDisclosureState(isOpen = false) {
	const button = new ElementBinder();
	const panel = new ElementBinder();
	const toggler = new Toggleable({ isOpen });
	const { nameChild } = useComponentNaming('disclosure');

	setContext({
		isOpen: toggler.isOpen,
		createDisclosureButton,
		createDisclosurePanel,
		close: toggler.close.bind(toggler),
		noButtonFocus: toggler.noButtonFocus,
	});

	function createDisclosureButton(id: string | undefined) {
		return defineActionComponent({
			binder: button,
			id: id,
			name: nameChild('button'),
			onInit: () => panel.finalName,
			onMount: ({ element }) =>
				toggler.createButton(element, {
					plugins: [handleAriaControls(panel), handleAriaExpanded]
				})
		});
	}

	function createDisclosurePanel(id: string | undefined) {
		return defineActionComponent({
			binder: panel,
			id: id,
			name: nameChild('panel'),
			isShowing: isOpen,
			onMount: ({ element }) => toggler.createPanel(element)
		});
	}

	return {
		isOpen: toggler.isOpen,
		button: createDisclosureButton('').action,
		panel: createDisclosurePanel('').action,
		close: toggler.close.bind(toggler)
	};
}

const { getContext, setContext } = useContext({
	component: 'disclosure',
	predicate: (val): val is Context =>
		isInterface<Context>(val, {
			isOpen: isStore,
			createDisclosureButton: isFunction,
			createDisclosurePanel: isFunction,
			close: isFunction,
			noButtonFocus: isRef
		})
});

export { getContext };
