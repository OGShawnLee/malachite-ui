import type { Readable, Updater, Writable } from 'svelte/store';
import type { ExtractContext, Nullable } from '$lib/types';
import { Component } from '$lib/core';
import { Bridge, Group, Toggleable } from '$lib/stores';
import {
	handleClickOutside,
	handleEscapeKey,
	handleFocusLeave,
	usePreventInternalFocus,
	useFocusTrap
} from '$lib/stores/toggleable';
import { focusFirstElement, makeReadable } from '$lib/utils';
import { useContext, useListener } from '$lib/hooks';
import { isObject, isHTMLElement } from '$lib/predicate';
import { tick } from 'svelte';

export default class Dialog extends Component {
	protected readonly Toggleable: Toggleable;

	protected readonly Overlay: Bridge;
	protected readonly Dialog: Bridge;
	protected readonly Content: Bridge;
	protected readonly Titles: Group;
	protected readonly Descriptions: Group;

	readonly Open: Readable<boolean>;
	initialFocus: Nullable<HTMLElement>;

	constructor(Settings: {
		Store: Writable<boolean> | boolean;
		initialValue: boolean;
		notifier: Updater<boolean>;
		initialFocus: Nullable<HTMLElement>;
	}) {
		super({ component: 'dialog', index: Dialog.generateIndex() });

		this.Toggleable = new Toggleable({
			Open: Settings.Store,
			initialValue: Settings.initialValue,
			notifier: Settings.notifier
		});

		this.Overlay = new Bridge();
		this.Dialog = new Bridge();
		this.Content = new Bridge();
		this.Titles = new Group();
		this.Descriptions = new Group();

		this.Open = makeReadable(this.Toggleable);
		this.initialFocus = Settings.initialFocus;

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
					})
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
		isObject(val, ['Open', 'close', 'overlay', 'dialog', 'content', 'initTitle', 'initDescription'])
});

type Context = ExtractContext<
	Dialog,
	'Open' | 'close' | 'overlay' | 'dialog' | 'content' | 'initTitle' | 'initDescription'
>;
