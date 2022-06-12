import type { ActionComponent, Navigable as Nav, Store } from '$lib/types';
import type { Readable } from 'svelte/store';
import { writable } from 'svelte/store';
import { defineActionComponent, initIndexGenerator } from '$lib/core';
import { useComponentNaming, useContext, useListener } from '$lib/hooks';
import { Bridge, Navigable, Ordered, Toggleable } from '$lib/stores';
import {
	handleClickOutside,
	handleEscapeKey,
	handleFocusLeave,
	usePreventInternalFocus
} from '$lib/stores/toggleable';
import {
	includes,
	isActionComponent,
	isFunction,
	isInterface,
	isNavigationKey,
	isStore
} from '$lib/predicate';
import { useActiveHover, useKeyMatch } from '$lib/stores/addons';
import { generate, makeReadable, ref } from '$lib/utils';

interface Options {
	Finite: Store<Readable<boolean>>;
	ShouldOrder: Store<Readable<boolean>>;
	Vertical: Store<Readable<boolean>>;
}

interface Context {
	Open: Readable<boolean>;
	button: ActionComponent;
	panel: ActionComponent;
	initItem: (Item: Bridge) => ActionComponent;
	close: Toggleable['close'];
}

const generateIndex = initIndexGenerator();

export function createMenu({ Finite, ShouldOrder, Vertical }: Options) {
	const Open = new Toggleable();
	const Items = new Ordered<Nav.Member>(ShouldOrder);
	const Navigation = new Navigable({
		Ordered: Items,
		Vertical: Vertical,
		Finite: Finite,
		ShouldWait: true,
		shouldFocus: false
	});
	const [Button, Panel] = generate(2, () => new Bridge());
	const { nameChild } = useComponentNaming({ component: 'menu', index: generateIndex() });

	setContext({
		Open: makeReadable(Open),
		button: createButton(),
		panel: createPanel(),
		close: Open.close.bind(Open),
		initItem: initItem
	});

	function createButton() {
		let isVertical = ref(false, Vertical);
		return defineActionComponent({
			Bridge: Button,
			onMount: ({ element }) => {
				element.ariaHasPopup = 'true';
				return nameChild('button');
			},
			destroy: ({ element }) => [
				isVertical.listen(),
				Open.button(element, {
					onChange: (isOpen) => {
						element.ariaExpanded = String(isOpen);
					}
				}),
				useListener(element, 'keydown', (event) => {
					if (!isNavigationKey(event.code)) return;
					if (includes(['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'], event.code))
						event.preventDefault();
					switch (event.code) {
						case 'ArrowDown':
							if (!isVertical.value) return;
							Navigation.startAt = event.ctrlKey ? 'LAST' : 'FIRST';
							return Open.open();
						case 'ArrowRight':
							if (isVertical.value) return;
							Navigation.startAt = event.ctrlKey ? 'LAST' : 'FIRST';
							return Open.open();
						case 'ArrowUp':
							if (!isVertical.value) return;
							Navigation.startAt = event.ctrlKey ? 'FIRST' : 'LAST';
							return Open.open();
						case 'ArrowLeft':
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

	function createPanel() {
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
					},
					handler() {
						return Navigable.initNavigationHandler(element, ({ event, code, ctrlKey }) => {
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
									return this.goLast();
								case 'Home':
									return this.goFirst();
								case 'Enter':
								case 'Space':
									event?.preventDefault();
									this.activeElement?.click();
							}
						});
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
					})
				];
			}
		});
	}

	return {
		Finite: Finite,
		ShouldOrder: ShouldOrder,
		Vertical: Vertical,
		button: createButton(),
		panel: createPanel(),
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
			panel: isActionComponent,
			initItem: isFunction,
			close: isFunction
		})
});

export { getContext };
