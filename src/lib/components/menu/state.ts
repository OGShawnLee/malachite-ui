import type { Readable } from 'svelte/store';
import type { ActionComponent, Navigable as Nav } from '$lib/types';
import { defineActionComponent, initIndexGenerator } from '$lib/core';
import { useComponentNaming, useContext, useListener } from '$lib/hooks';
import { Bridge, Navigable, Ordered, Toggleable } from '$lib/stores';
import { useActiveHover, useKeyMatch } from '$lib/stores/addons';
import {
	handleClickOutside,
	handleEscapeKey,
	handleFocusLeave,
	usePreventInternalFocus
} from '$lib/stores/toggleable';
import { createStoreWrapper, generate, makeReadable, ref } from '$lib/utils';
import {
	isActionComponent,
	isDisabled,
	isFunction,
	isInterface,
	isNavigationKey,
	isStore
} from '$lib/predicate';
import { writable } from 'svelte/store';

interface Configuration {
	Finite: boolean | Readable<boolean>;
	ShouldOrder: boolean | Readable<boolean>;
	Vertical: boolean | Readable<boolean>;
}

interface Context {
	Open: Readable<boolean>;
	button: ActionComponent;
	items: ActionComponent;
	initItem: (Item: Bridge) => ActionComponent;
	close: OmitThisParameter<Toggleable['close']>;
}

const generateIndex = initIndexGenerator();

export function createMenu({
	Finite: uFinite,
	ShouldOrder: uOrder,
	Vertical: uVertical
}: Configuration) {
	const Open = new Toggleable();
	const Finite = createStoreWrapper({ Store: uFinite, initialValue: false });
	const Vertical = createStoreWrapper({ Store: uVertical, initialValue: true });
	const Order = createStoreWrapper({ Store: uOrder, initialValue: false });
	const Items = new Ordered<Nav.Member>(Order);
	const Navigation = new Navigable({
		Finite: Finite,
		Ordered: Items,
		Vertical: Vertical,
		ShouldWait: true,
		shouldFocus: false
	});
	const [Button, Panel] = generate(2, () => new Bridge());
	const { nameChild } = useComponentNaming({ name: 'menu', index: generateIndex() });

	function createButton() {
		const isVertical = ref(true, Vertical);
		return defineActionComponent({
			Bridge: Button,
			onMount: ({ element }) => {
				element.ariaHasPopup = 'true';
				return nameChild('button');
			},
			destroy: ({ element }) => [
				isVertical.listen(),
				Open.button(element, {
					onChange(isOpen) {
						element.ariaExpanded = String(isOpen);
					}
				}),
				useListener(element, 'keydown', (event) => {
					if (!isNavigationKey(event.code)) return;
					switch (event.code) {
						case 'ArrowDown':
							event.preventDefault();
							if (!isVertical.value) return;
							Navigation.startAt = event.ctrlKey ? 'LAST' : 'FIRST';
							return Open.open();
						case 'ArrowRight':
							event.preventDefault();
							if (isVertical.value) return;
							Navigation.startAt = event.ctrlKey ? 'LAST' : 'FIRST';
							return Open.open();
						case 'ArrowUp':
							event.preventDefault();
							if (!isVertical.value) return;
							Navigation.startAt = event.ctrlKey ? 'FIRST' : 'LAST';
							return Open.open();
						case 'ArrowLeft':
							event.preventDefault();
							if (isVertical.value) return;
							Navigation.startAt = event.ctrlKey ? 'FIRST' : 'LAST';
							return Open.open();
						case 'Enter':
						case 'Space':
							Navigation.startAt = 'FIRST';
							return Open.isClosed && Open.open();
					}
				}),
				Panel.Name.subscribe((id) => {
					if (id) element.setAttribute('aria-controls', id);
					else element.removeAttribute('aria-controls');
				})
			]
		});
	}

	function createItems() {
		return defineActionComponent({
			Bridge: Panel,
			onMount: ({ element }) => {
				element.setAttribute('role', 'menu');
				return nameChild('items');
			},
			destroy: ({ element }) => [
				Open.panel(element, {
					isFocusable: true,
					plugins: [usePreventInternalFocus],
					handlers: [handleClickOutside, handleEscapeKey, handleFocusLeave],
					onOpen: () => element.focus()
				}),
				Navigation.initNavigation(element, {
					plugins: [useActiveHover, useKeyMatch],
					preventTabbing: true,
					onClose() {
						this.Waiting.set(true);
						this.hardSet(0, false);
						this.startAt = 'AUTO';
					}
				}),
				Navigation.initNavigationHandler({
					parent: element,
					callback({ event, code, ctrlKey }) {
						switch (code) {
							case 'ArrowDown':
							case 'ArrowRight':
								event.preventDefault();
								return this.handleNextKey(code, ctrlKey);
							case 'ArrowLeft':
							case 'ArrowUp':
								event.preventDefault();
								return this.handleBackKey(code, ctrlKey);
							case 'End':
								event.preventDefault();
								return this.goLast();
							case 'Home':
								event.preventDefault();
								return this.goFirst();
							case 'Enter':
							case 'Space':
								event?.preventDefault();
								this.activeElement?.click();
						}
					}
				}),
				Navigation.Active.subscribe((active) => {
					if (!active || (active[0] && !active[0].id))
						return element.removeAttribute('aria-activedescendant');

					const [{ id }] = active;
					element.setAttribute('aria-activedescendant', id);
				}),
				Navigation.listenSelected(),
				Navigation.Vertical.subscribe((isVertical) => {
					element.ariaOrientation = isVertical ? 'vertical' : 'horizontal';
				}),
				Button.Name.subscribe((id) => {
					if (id) element.setAttribute('aria-labelledby', id);
					else element.removeAttribute('aria-labelledby');
				})
			]
		});
	}

	function initItem(Item: Bridge) {
		return defineActionComponent({
			Bridge: Item,
			onMount: ({ element }) => {
				element.tabIndex = -1;
				element.setAttribute('role', 'menuitem');
				return nameChild('item', Items.size);
			},
			destroy: ({ element }) => {
				const Index = writable(Items.size);
				return [
					Navigation.initItem(element, {
						Bridge: Item,
						Value: { Index },
						focusOnSelection: false
					}),
					Index.subscribe((index) => {
						Item.name = nameChild('item', index);
					}),
					useListener(element, 'click', (event) => {
						if (event.defaultPrevented) return;
						if (isDisabled(element)) {
							event.stopImmediatePropagation();
							event.preventDefault();
						} else Open.close(event);
					})
				];
			}
		});
	}

	setContext({
		Open: makeReadable(Open),
		button: createButton(),
		items: createItems(),
		initItem: initItem,
		close: Open.close.bind(Open)
	});

	return {
		Open: makeReadable(Open),
		Finite: Finite,
		Vertical: Vertical,
		ShouldOrder: Order,
		button: createButton(),
		items: createItems(),
		initItem: initItem,
		close: Open.close.bind(Open)
	};
}

const { getContext, setContext } = useContext({
	component: 'menu',
	predicate: (val): val is Context =>
		isInterface<Context>(val, {
			Open: isStore,
			button: isActionComponent,
			items: isActionComponent,
			initItem: isFunction,
			close: isFunction
		})
});

export { getContext };
