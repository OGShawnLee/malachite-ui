import type { Expand, ExtractContext, Navigable as Nav, Nullable, Ref, Store } from '$lib/types';
import type { Readable } from 'svelte/store';
import { Bridge, Navigable, Ordered, storable, Toggleable } from '$lib/stores';
import {
	handleClickOutside,
	handleEscapeKey,
	handleFocusLeave,
	usePreventInternalFocus
} from '$lib/stores/toggleable';
import { useActiveHover, useKeyMatch } from '$lib/stores/addons';
import { Component } from '$lib/core';
import { writable } from 'svelte/store';
import { useContext, useListener } from '$lib/hooks';
import { makeReadable } from '$lib/utils';
import {
	isActionComponent,
	isDisabled,
	isFunction,
	isInterface,
	isNavigationKey,
	isStore
} from '$lib/predicate';

export default class Menu extends Component {
	protected readonly Toggleable: Toggleable;
	protected readonly Navigable: Navigable;
	protected readonly Items: Ordered<Nav.Member>;

	readonly Open: Readable<boolean>;
	protected readonly Button = new Bridge();
	protected readonly Panel = new Bridge();

	readonly Finite: Store<Readable<boolean>>;
	readonly Vertical: Store<Readable<boolean>>;
	readonly ShouldOrder: Store<Readable<boolean>>;

	protected isVertical = false;

	constructor({ Finite, Vertical, ShouldOrder }: Expand<Options>) {
		super({ component: 'menu', index: Menu.generateIndex() });

		this.Finite = storable({ Store: Finite, initialValue: false });
		this.ShouldOrder = storable({ Store: ShouldOrder, initialValue: false });
		this.Vertical = storable({ Store: Vertical, initialValue: true });

		this.Toggleable = new Toggleable();
		this.Items = new Ordered(this.ShouldOrder);
		this.Navigable = new Navigable({
			Finite: this.Finite,
			Ordered: this.Items,
			ShouldWait: true,
			Vertical: this.Vertical,
			shouldFocus: false
		});

		this.Open = makeReadable(this.Toggleable);

		Context.setContext({
			Open: this.Open,
			button: this.button,
			initItem: this.initItem.bind(this),
			items: this.items,
			close: this.close
		});
	}

	get close() {
		return this.Toggleable.close.bind(this.Toggleable);
	}

	get button() {
		return this.defineActionComponent({
			Bridge: this.Button,
			onMount: ({ element }) => {
				element.ariaHasPopup = 'true';
				return this.nameChild('button');
			},
			destroy: ({ element }) => [
				this.Toggleable.button(element, {
					onChange: (isOpen) => {
						element.ariaExpanded = String(isOpen);
					}
				}),
				useListener(element, 'keydown', (event) => {
					if (!isNavigationKey(event.code)) return;
					switch (event.code) {
						case 'ArrowDown':
							event.preventDefault();
							if (!this.isVertical) return;
							this.Navigable.startAt = event.ctrlKey ? 'LAST' : 'FIRST';
							return this.Toggleable.open();
						case 'ArrowRight':
							event.preventDefault();
							if (this.isVertical) return;
							this.Navigable.startAt = event.ctrlKey ? 'LAST' : 'FIRST';
							return this.Toggleable.open();
						case 'ArrowUp':
							event.preventDefault();
							if (!this.isVertical) return;
							this.Navigable.startAt = event.ctrlKey ? 'FIRST' : 'LAST';
							return this.Toggleable.open();
						case 'ArrowLeft':
							event.preventDefault();
							if (this.isVertical) return;
							this.Navigable.startAt = event.ctrlKey ? 'FIRST' : 'LAST';
							return this.Toggleable.open();
						case 'Enter':
						case 'Space':
							this.Navigable.startAt = 'FIRST';
							return this.Toggleable.isClosed && this.Toggleable.open();
					}
				}),
				this.Vertical.subscribe((isVertical) => {
					this.isVertical = isVertical;
				}),
				this.Panel.Name.subscribe((id) => {
					if (id) element.setAttribute('aria-controls', id);
					else element.removeAttribute('aria-controls');
				})
			]
		});
	}

	get items() {
		return this.defineActionComponent({
			Bridge: this.Panel,
			onMount: ({ element }) => {
				element.setAttribute('role', 'menu');
				return this.nameChild('items');
			},
			destroy: ({ element }) => [
				this.Toggleable.panel(element, {
					isFocusable: true,
					plugins: [usePreventInternalFocus],
					handlers: [handleClickOutside, handleEscapeKey, handleFocusLeave],
					onOpen: () => element.focus()
				}),
				this.Navigable.initNavigation(element, {
					plugins: [useActiveHover, useKeyMatch],
					preventTabbing: true,
					onClose() {
						this.Waiting.set(true);
						this.hardSet(0, false);
						this.startAt = 'AUTO';
					}
				}),
				this.Navigable.initNavigationHandler({
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
				this.Navigable.Active.subscribe((active) => {
					if (!active || (active[0] && !active[0].id))
						return element.removeAttribute('aria-activedescendant');

					const [{ id }] = active;
					element.setAttribute('aria-activedescendant', id);
				}),
				this.Navigable.listenSelected(),
				this.Navigable.Vertical.subscribe((isVertical) => {
					element.ariaOrientation = isVertical ? 'vertical' : 'horizontal';
				}),
				this.Button.Name.subscribe((id) => {
					if (id) element.setAttribute('aria-labelledby', id);
					else element.removeAttribute('aria-labelledby');
				})
			]
		});
	}

	initItem(Item: Bridge) {
		return this.defineActionComponent({
			Bridge: Item,
			onMount: ({ element }) => {
				element.tabIndex = -1;
				element.setAttribute('role', 'menuitem');
				const index = this.Items.size;
				return this.nameChild({ name: 'item', index });
			},
			destroy: ({ element }) => {
				const Index = writable(this.Items.size);
				return [
					this.Navigable.initItem(element, {
						Bridge: Item,
						Value: { Index },
						focusOnSelection: false
					}),
					Index.subscribe((index) => {
						Item.name = this.nameChild({ name: 'item', index });
					}),
					useListener(element, 'click', (event) => {
						if (event.defaultPrevented) return;
						if (isDisabled(element)) {
							event.stopImmediatePropagation();
							event.preventDefault();
						} else this.close(event);
					})
				];
			}
		});
	}

	private static generateIndex = this.initIndexGenerator();
}

interface Options {
	ShouldOrder: Readable<boolean> | boolean;
	Vertical: Readable<boolean> | boolean;
	Finite: Readable<boolean> | boolean;
}

export const Context = useContext({
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

type Context = ExtractContext<Menu, 'Open' | 'button' | 'initItem' | 'items' | 'close'>;
