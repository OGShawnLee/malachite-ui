import type { ComponentInitialiser, ComponentInitialiserStrict, Navigation } from '$lib/types';
import ToolbarContext from '../toolbar/context';
import { Navigable, Toggleable } from '$lib/stores';
import { ElementBinder, defineActionComponent } from '$lib/core';
import { useComponentNaming, useContext, useListener } from '$lib/hooks';
import {
	handleAriaControls,
	handleAriaExpanded,
	handleAriaLabelledby,
	handleAriaOrientation,
	useCloseClickOutside,
	useCloseEscapeKey,
	useCloseFocusLeave,
	useHoverMove,
	usePreventTabbing,
	useKeyMatch,
	useNavigationStarter
} from '$lib/plugins';
import { isDisabled, isFunction, isInterface, isStore } from '$lib/predicate';
import type { Readable } from 'svelte/store';

export function createMenuState(settings: Navigation.Settings) {
	const button = new ElementBinder();
	const navigation = new Navigable(settings);
	const panel = new ElementBinder();
	const toggler = new Toggleable();
	const toolbar = ToolbarContext.getContext(false);
	const { nameChild } = useComponentNaming('menu');

	setContext({
		isOpen: toggler.isOpen,
		createMenuButton,
		createMenuItem,
		createMenuPanel
	});

	function createMenuButton(id: string | undefined) {
		return defineActionComponent({
			id: id,
			binder: button,
			name: nameChild('button'),
			onMount: ({ element }) => {
				element.ariaHasPopup = 'true';
				return [
					toggler.createButton(element, {
						plugins: [
							useNavigationStarter(navigation, toolbar),
							handleAriaControls(panel),
							handleAriaExpanded
						]
					}),
					toolbar?.item(element)
				];
			}
		});
	}

	function createMenuPanel(id: string | undefined) {
		return defineActionComponent({
			binder: panel,
			id: id,
			name: nameChild('items'),
			isShowing: false,
			onMount: ({ element }) => {
				element.role = 'menu';
				element.tabIndex = 0;
				return [
					navigation.initNavigation(element, {
						plugins: [handleAriaOrientation, useHoverMove, usePreventTabbing, useKeyMatch],
						onDestroy: () => navigation.isWaiting.set(true)
					}),
					toggler.createPanel(element, {
						plugins: [
							handleAriaLabelledby(button),
							useCloseClickOutside,
							useCloseEscapeKey,
							useCloseFocusLeave
						],
						onOpen: () => element.focus()
					}),
					navigation.active.subscribe((item) => {
						const name = item?.binder.finalName.value();
						if (name) element.setAttribute('aria-activedescendant', name);
						else element.removeAttribute('aria-activedescendant');
					})
				];
			}
		});
	}

	function createMenuItem(id: string | undefined, binder: ElementBinder) {
		return defineActionComponent({
			binder: binder,
			id: id,
			name: nameChild('item'),
			onInit: ({ binder, name }) => {
				navigation.onInitItem(name, binder, {});
			},
			onMount: ({ element, name }) => {
				element.role = 'menuitem';
				element.tabIndex = -1;
				return [
					navigation.initItem(element, name),
					useListener(element, 'click', () => {
						if (isDisabled(element)) return;
						toggler.close();
						element.click();
					})
				];
			}
		});
	}

	return {
		isOpen: toggler.isOpen,
		navigation,
		button: createMenuButton('').action,
		panel: createMenuPanel('').action
	};
}

interface Context {
	isOpen: Readable<boolean>;
	createMenuButton: ComponentInitialiser;
	createMenuPanel: ComponentInitialiser;
	createMenuItem: ComponentInitialiserStrict;
}

const { getContext, setContext } = useContext({
	component: 'menu',
	predicate: (context): context is Context =>
		isInterface<Context>(context, {
			isOpen: isStore,
			createMenuButton: isFunction,
			createMenuItem: isFunction,
			createMenuPanel: isFunction
		})
});

export { getContext };
