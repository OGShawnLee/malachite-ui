import type { Toggleable } from '$lib/stores';
import type { Readable } from 'svelte/store';
import type { Action, ComponentInitialiser } from '$lib/types';
import type { ElementBinder } from '$lib/core';
import { useContext } from '$lib/hooks';
import { isElementBinder, isFunction, isInterface, isStore } from '$lib/predicate';

interface Context {
	createAccordionItemState(): {
		button: Action;
		close: OmitThisParameter<Toggleable['close']>;
		heading: Action;
		isOpen: Readable<boolean>;
		panel: Action;
	};
}

export const GroupContext = useContext<Context>({
	component: 'accordion',
	predicate: (context): context is Context =>
		isInterface<Context>(context, {
			createAccordionItemState: isFunction
		})
});

interface ItemContext {
	isOpen: Readable<boolean>;
	button: ElementBinder;
	close: OmitThisParameter<Toggleable['close']>;
	panel: ElementBinder;
	createAccordionButton: ComponentInitialiser;
	createAccordionHeading: ComponentInitialiser;
	createAccordionPanel: ComponentInitialiser;
}

export const ItemContext = useContext<ItemContext>({
	component: 'accordion-item',
	predicate: (context): context is ItemContext =>
		isInterface<ItemContext>(context, {
			button: isElementBinder,
			close: isFunction,
			createAccordionButton: isFunction,
			createAccordionHeading: isFunction,
			createAccordionPanel: isFunction,
			isOpen: isStore,
			panel: isElementBinder
		})
});
