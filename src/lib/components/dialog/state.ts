import type { Readable, Writable } from 'svelte/store';
import type { Expand, ExtractContext, Nullable } from '$lib/types';
import { Component } from '$lib/core';
import { Bridge, Group, Toggleable } from '$lib/stores';
import {
	handleClickOutside,
	handleEscapeKey,
	handleFocusLeave,
	usePreventInternalFocus,
	useFocusTrap
} from '$lib/stores/toggleable';
import { focusFirstElement, makeReadable, useHideScrollbar } from '$lib/utils';
import { useContext, useListener } from '$lib/hooks';
import { isHTMLElement, isInterface, isStore, isActionComponent, isFunction } from '$lib/predicate';
import { tick } from 'svelte';

export default class Dialog extends Component {
	protected readonly Toggleable: Toggleable;

	protected readonly Overlay = new Bridge();
	protected readonly Dialog = new Bridge();
	protected readonly Content = new Bridge();
	protected readonly Titles = new Group();
	protected readonly Descriptions = new Group();

	readonly Open: Readable<boolean>;
	initialFocus: Nullable<HTMLElement>;

	constructor({ Store, initialFocus, initialValue, notifier }: Expand<Options>) {
		super({ component: 'dialog', index: Dialog.generateIndex() });

		this.Toggleable = new Toggleable({ Open: Store, initialValue, notifier });

		this.Open = makeReadable(this.Toggleable);
		this.initialFocus = initialFocus;

		Context.setContext({
			Open: this.Open,
			close: this.close,
			overlay: this.overlay,
			dialog: this.dialog,
			content: this.content,
			initTitle: this.initTitle.bind(this),
			initDescription: this.initDescription.bind(this)
		});
	}

	get subscribe() {
		return this.Toggleable.subscribe;
	}

	get sync() {
		return this.Toggleable.sync;
	}

	get close() {
		return this.Toggleable.close.bind(this.Toggleable);
	}

	get overlay() {
		return this.defineActionComponent({
			Bridge: this.Overlay,
			onMount: this.nameChild('overlay'),
			destroy: ({ element }) => [
				useListener(element, 'click', (event) => {
					if (event.target === element) this.close();
				})
			]
		});
	}

	get dialog() {
		return this.defineActionComponent({
			Bridge: this.Dialog,
			onMount: ({ element }) => {
				element.ariaModal = 'true';
				element.setAttribute('role', 'dialog');
				return this.nameChild('dialog');
			},
			destroy: ({ element }) => {
				let button = document.activeElement;
				if (!isHTMLElement(button)) throw new Error('Unable to Find Dialog Toggler');
				return [
					this.Toggleable.button(button, { isToggler: false }),
					this.Titles.Name.subscribe((id) => {
						if (id) element.setAttribute('aria-labelledby', id);
						else element.removeAttribute('aria-labelledby');
					}),
					this.Descriptions.Name.subscribe((id) => {
						if (id) element.setAttribute('aria-describedby', id);
						else element.removeAttribute('aria-describedby');
					}),
					useHideScrollbar(makeReadable(this.Toggleable))
				];
			}
		});
	}

	get content() {
		return this.defineActionComponent({
			Bridge: this.Content,
			onMount: this.nameChild('content'),
			destroy: ({ element }) => [
				this.Toggleable.panel(element, {
					plugins: [useFocusTrap, usePreventInternalFocus],
					handlers: [handleClickOutside, handleEscapeKey, handleFocusLeave]
				}),
				this.Toggleable.subscribe(async (isOpen) => {
					await tick();
					if (isOpen) focusFirstElement(element, { initialFocus: this.initialFocus });
				})
			]
		});
	}

	get title() {
		return this.initTitle({ Title: new Bridge() });
	}

	initTitle(this: Dialog, { Title }: { Title: Bridge }) {
		return this.defineActionComponent({
			Bridge: Title,
			onMount: () => {
				const index = this.Titles.size;
				return this.nameChild({ name: 'title', index });
			},
			destroy: ({ element, name }) => [this.Titles.add(element, name)]
		});
	}

	get description() {
		return this.initDescription({ Description: new Bridge() });
	}

	initDescription(this: Dialog, { Description }: { Description: Bridge }) {
		return this.defineActionComponent({
			Bridge: Description,
			onMount: () => {
				const index = this.Descriptions.size;
				return this.nameChild({ name: 'description', index });
			},
			destroy: ({ element, name }) => [this.Descriptions.add(element, name)]
		});
	}

	protected static generateIndex = this.initIndexGenerator();
}

export const Context = useContext<Context>({
	component: 'dialog',
	predicate: (val): val is Context =>
		isInterface<Context>(val, {
			Open: isStore,
			content: isActionComponent,
			dialog: isActionComponent,
			overlay: isActionComponent,
			initDescription: isFunction,
			initTitle: isFunction,
			close: isFunction
		})
});

type Context = ExtractContext<
	Dialog,
	'Open' | 'close' | 'overlay' | 'dialog' | 'content' | 'initTitle' | 'initDescription'
>;

interface Options {
	Store: Writable<boolean> | boolean;
	initialFocus: Nullable<HTMLElement>;
	initialValue: boolean;
	notifier: (isOpen: boolean) => void;
}
