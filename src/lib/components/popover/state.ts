import type { ComponentInitialiser, ExtractContextKeys, Toggler } from '$lib/types';
import type { Readable } from 'svelte/store';
import { Toggleable } from '$lib/stores';
import { defineActionComponent, ElementBinder } from '$lib/core';
import { useComponentNaming, useContext } from '$lib/hooks';
import { isFunction, isInterface, isReadableRef } from '$lib/predicate';
import { createReadableRef } from '$lib/utils';
import {
	handleAriaControls,
	handleAriaExpanded,
	useCloseClickOutside,
	useCloseEscapeKey,
	useCloseFocusLeave
} from '$lib/plugins';

interface Context {
	isOpen: Readable<boolean>;
	close: OmitThisParameter<Toggleable['close']>;
	createPopoverButton: ComponentInitialiser<Readable<string | undefined>>;
	createPopoverOverlay: ComponentInitialiser;
	createPopoverPanel: ComponentInitialiser;
}

export type ContextKeys = ExtractContextKeys<Context>;

export function createPopoverState(settings: Toggler.Settings) {
	const button = new ElementBinder();
	const panel = new ElementBinder();
	const toggler = new Toggleable(settings);
	const { nameChild } = useComponentNaming('popover');

	setContext({
		isOpen: createReadableRef(toggler.isOpen),
		close: toggler.close.bind(toggler),
		createPopoverButton,
		createPopoverOverlay,
		createPopoverPanel
	});

	function createPopoverButton(id: string | undefined) {
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

	function createPopoverOverlay(id: string | undefined) {
		return defineActionComponent({
			id: id,
			name: nameChild('overlay'),
			isShowing: false,
			onMount: ({ element }) => toggler.createOverlay(element)
		});
	}

	function createPopoverPanel(id: string | undefined) {
		return defineActionComponent({
			binder: panel,
			id: id,
			name: nameChild('panel'),
			isShowing: false,
			onMount: ({ element }) =>
				toggler.createPanel(element, {
					plugins: [useCloseClickOutside, useCloseEscapeKey, useCloseFocusLeave]
				})
		});
	}

	return {
		isFocusForced: toggler.isFocusForced,
		isOpen: toggler.isOpen,
		button: createPopoverButton('').action,
		close: toggler.close.bind(toggler),
		overlay: createPopoverOverlay('').action,
		panel: createPopoverPanel('').action
	};
}

const { getContext, setContext } = useContext({
	component: 'popover',
	predicate: (context): context is Context =>
		isInterface<Context>(context, {
			isOpen: isReadableRef,
			close: isFunction,
			createPopoverButton: isFunction,
			createPopoverOverlay: isFunction,
			createPopoverPanel: isFunction
		})
});

export { getContext };
