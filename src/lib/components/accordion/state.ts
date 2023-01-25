import type { ActionComponent, Expand, ExtractContext, Navigable as Nav, Store } from '$lib/types';
import { type Readable, derived, writable } from 'svelte/store';
import { Component, defineActionComponent, defineActionComponentWithParams } from '$lib/core';
import {
	isActionComponent,
	isFunction,
	isInterface,
	isNumber,
	isStore,
	isString
} from '$lib/predicate';
import { Bridge, Hashable, Navigable, Ordered, type Toggleable } from '$lib/stores';
import { useHidePanelFocusOnClose } from '$lib/plugins';
import { generate, makeReadable, setAttribute } from '$lib/utils';
import { onDestroy, tick } from 'svelte';
import { useContext, useListener, usePair } from '$lib/hooks';

export default class Accordion extends Component {
	protected readonly Buttons: Ordered<ItemInstance & Nav.Member>;
	protected readonly Navigable: Navigable<ItemInstance>;

	readonly Open: Readable<boolean>;
	protected readonly Items = new Hashable<number, Toggleable>();
	readonly Finite: Store<Readable<boolean>>;
	readonly ShouldOrder: Store<Readable<boolean>>;

	protected isInitialised = false;
	protected previousOpenItem: ItemInstance | undefined;

	constructor({ Finite, ShouldOrder }: Expand<Options>) {
		super({ component: 'accordion', index: Accordion.generateIndex() });

		this.Finite = Finite;
		this.ShouldOrder = ShouldOrder;

		this.Buttons = new Ordered(ShouldOrder);
		this.Navigable = new Navigable({ Ordered: this.Buttons, Finite, Vertical: true });

		this.Open = derived(this.Buttons.Members, (items) => {
			return items.some(({ isOpen }) => isOpen);
		});

		Context.setContext({
			accordion: this.accordion,
			initItem: this.initItem.bind(this)
		});
	}

	get accordion() {
		return this.defineActionComponent({
			onMount: this.name,
			destroy: ({ element }) => [
				this.Navigable.initNavigation(element),
				this.Navigable.initNavigationHandler({
					parent: element,
					callback({ event, code, ctrlKey }) {
						if (!this.isWithin(document.activeElement)) return;
						switch (code) {
							case 'ArrowDown':
								event.preventDefault();
								return this.handleNextKey(code, ctrlKey);
							case 'ArrowUp':
								event.preventDefault();
								return this.handleBackKey(code, ctrlKey);
							case 'End':
								event.preventDefault();
								return this.goLast();
							case 'Home':
								event.preventDefault();
								return this.goFirst();
						}
					}
				})
			]
		});
	}

	protected handleAriaLevel(header: HTMLElement, level: string | number | undefined) {
		if (isNumber(level) || isString(level)) return (header.ariaLevel = level.toString());
		const [h, number] = header.tagName;
		if (header.tagName.length === 2 && h === 'H' && isNumber(Number(number))) {
			header.ariaLevel = number;
		} else header.ariaLevel = '2';
	}

	protected handleButtonFocus(button: HTMLElement) {
		return useListener(button, 'focus', async () => {
			await tick();
			const index = this.Navigable.indexOf(button);
			if (index < 0 || this.Navigable.isSelected(index)) return;
			this.Navigable.set(index);
		});
	}

	protected handleUnique(button: HTMLElement, Toggleable: Toggleable) {
		return Toggleable.subscribe((isOpen) => {
			if (!isOpen) return;
			const item = this.Buttons.get(button);
			if (button !== this.previousOpenItem?.button) this.previousOpenItem?.close();
			this.previousOpenItem = item;
		});
	}

	initItem({ Toggleable, initialOpen }: { Toggleable: Toggleable; initialOpen: boolean }) {
		const { destroy, index } = this.Items.push(Toggleable);
		onDestroy(() => destroy());

		if (initialOpen && !this.isInitialised) {
			this.isInitialised = true;
			Toggleable.open();
		}

		const [Button, Header, Panel] = generate(3, () => new Bridge());
		const { nameChild } = useName({ parent: this.name, component: 'item', index });

		return ItemContext.setContext({
			Open: makeReadable(Toggleable),
			close: Toggleable.close.bind(Toggleable),
			button: defineActionComponent({
				Bridge: Button,
				onMount: ({ element }) => {
					setAttribute(element, ['tabIndex', '0'], {
						overwrite: true,
						predicate: () => element.tabIndex <= 0
					});
					return nameChild('button');
				},
				destroy: ({ element }) => [
					Toggleable.button(element, {
						onChange: (isOpen) => {
							element.ariaExpanded = String(isOpen);
						}
					}),
					this.Navigable.initItem(element, {
						Bridge: Button,
						Value: {
							Index: writable(this.Buttons.size),
							button: element,
							close: () => Toggleable.set(false),
							isOpen: Toggleable.isOpen
						}
					}),
					this.handleUnique(element, Toggleable),
					this.handleButtonFocus(element),
					Panel.Name.subscribe((id) => {
						if (id) element.setAttribute('aria-controls', id);
						else element.removeAttribute('aria-controls');
					}),
					usePair(Button.Disabled, Panel).subscribe(([isDisabled, panel]) => {
						if (isDisabled && panel) element.ariaDisabled = 'true';
						else element.ariaDisabled = null;
					})
				]
			}),
			header: defineActionComponentWithParams<number | string>({
				Bridge: Header,
				onMount: ({ element, parameter: level }) => {
					this.handleAriaLevel(element, level);
					setAttribute(element, ['role', 'heading'], {
						overwrite: true,
						predicate: () => !this.isHeadingTagName(element)
					});
					return nameChild('header');
				},
				onUpdate: ({ element, parameter: level }) => {
					this.handleAriaLevel(element, level);
				}
			}),
			panel: defineActionComponent({
				Bridge: Panel,
				onMount: () => {
					return nameChild('panel');
				},
				destroy: ({ element }) => [
					Toggleable.panel(element, {
						plugins: [useHidePanelFocusOnClose]
					}),
					Button.Name.subscribe((id) => {
						if (id) element.setAttribute('aria-labelledby', id);
						else element.removeAttribute('aria-labelledby');
					}),
					this.Items.Size.subscribe((size) => {
						if (size <= 6) element.setAttribute('role', 'region');
						else element.removeAttribute('role');
					})
				]
			})
		});
	}

	protected isHeadingTagName(element: HTMLElement) {
		return ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(element.tagName);
	}

	private static generateIndex = this.initIndexGenerator();
}

function useName(configuration: { parent: string; component: string; index: number }) {
	const { parent, component, index } = configuration;
	const baseName = `${parent}-${component}-${index + 1}`;
	return {
		baseName,
		nameChild(component: string, index?: number) {
			if (isNumber(index)) return `${baseName}-${component}-${index + 1}`;
			return `${baseName}-${component}`;
		}
	};
}

export const Context = useContext({
	component: 'accordion',
	predicate: (val): val is Context =>
		isInterface<Context>(val, {
			accordion: isActionComponent,
			initItem: isFunction
		})
});

type Context = ExtractContext<Accordion, 'accordion' | 'initItem'>;

export const ItemContext = useContext({
	component: 'accordion-item',
	predicate: (val): val is ItemContext =>
		isInterface<ItemContext>(val, {
			Open: isStore,
			close: isFunction,
			button: isActionComponent,
			panel: isActionComponent,
			header: isActionComponent
		})
});

type ItemContext = {
	Open: Readable<boolean>;
	close: (ref?: Event | HTMLElement) => void;
	button: ActionComponent;
	header: ActionComponent<number | string>;
	panel: ActionComponent;
};

interface Options {
	Finite: Store<Readable<boolean>>;
	ShouldOrder: Store<Readable<boolean>>;
}

interface ItemInstance {
	isOpen: boolean;
	close: () => void;
	button: HTMLElement;
}
