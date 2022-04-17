import type { Store } from '$lib';
import type { Unsubscriber, Writable } from 'svelte/store';
import { makeUnique, setAttribute } from '@utils';
import { hasTagName, isFocusable, isHTMLElement, isNullish, isWithin } from '@predicate';
import { useCleanup, useCollector, useDataSync, useListener } from '@hooks';
import { storable } from '@stores/storable';

export * from './handler';
export * from './plugin';

export class Toggleable {
	protected readonly Open: Store<boolean>;
	protected readonly primitive: {
		isOpen: boolean;
		button?: HTMLElement;
		panel?: HTMLElement;
	} = {
		isOpen: false
	};

	constructor({ Open, initialValue = false, notifier }: Expand<Toggleable.Options> = {}) {
		this.Open = storable({ Store: Open, initialValue, notifier });
	}

	get subscribe() {
		return this.Open.subscribe;
	}

	get sync() {
		return this.Open.sync;
	}

	listen(this: Toggleable, onChange?: (isOpen: boolean) => void) {
		const sync = useDataSync(this.primitive);
		return useCleanup(sync(this.Open, 'isOpen', onChange));
	}

	open(this: Toggleable) {
		this.Open.set(true);
	}

	close(this: Toggleable, ref?: Event | HTMLElement) {
		this.Open.set(false);
		this.handleFocus(ref);
	}

	toggle(this: Toggleable) {
		this.Open.update((val) => !val);
	}

	set(this: Toggleable, value: boolean) {
		return this.Open.set(value);
	}

	protected focusButton(this: Toggleable, event?: Event) {
		event?.preventDefault();
		this.elements.button?.focus();
	}

	protected handleFocus(this: Toggleable, ref?: Event | HTMLElement) {
		if (!ref) return this.focusButton();

		if (ref instanceof Event) {
			return this.isValidRef(ref) ? void 64 : this.focusButton(ref);
		}

		if (ref instanceof HTMLElement) {
			return this.isValidRef(ref) ? ref.focus() : this.focusButton();
		}
	}

	protected isValidRef(this: Toggleable, ref?: Event | HTMLElement) {
		const target = isHTMLElement(ref) ? ref : ref?.target;
		return !isNullish(target) && isFocusable(target) && !isWithin(this.elements.panel, target);
	}

	protected get handleAttributes() {
		return {
			button: (button: HTMLElement) => {
				if (hasTagName(button, 'button')) setAttribute(button, ['type', 'button']);
				else setAttribute(button, ['role', 'button']);
				return button;
			}
		};
	}

	protected handleClick(this: Toggleable, button: HTMLElement) {
		return useListener(button, 'click', this.toggle.bind(this));
	}

	button(
		this: Toggleable,
		element: HTMLElement,
		options: {
			isToggler?: boolean;
			onChange?: (isOpen: boolean) => void;
		} = {}
	) {
		const { onChange, isToggler = true } = options;
		this.primitive.button = this.handleAttributes.button(element);
		return useCollector({
			beforeCollection: () => {
				this.primitive.button = undefined;
			},
			init: () => [this.listen(onChange), isToggler && this.handleClick(element)]
		});
	}

	panel(
		this: Toggleable,
		element: HTMLElement,
		options: {
			handlers?: Array<(this: Toggleable, panel: HTMLElement) => Unsubscriber>;
			plugins?: Array<(this: Toggleable, panel: HTMLElement) => Unsubscriber>;
			onOpen?: (panel: HTMLElement) => void;
		} = {}
	) {
		const { handlers = [], plugins = [], onOpen } = options;

		this.primitive.panel = element;
		return useCollector({
			beforeCollection: () => {
				this.primitive.panel = undefined;
			},
			init: () => [
				onOpen && this.Open.subscribe((isOpen) => isOpen && onOpen(element)),
				makeUnique(handlers).map((handler) => handler.bind(this)(element)),
				makeUnique(plugins).map((plugins) => plugins.bind(this)(element))
			]
		});
	}

	get isOpen() {
		return this.primitive.isOpen;
	}

	get isClosed() {
		return !this.primitive.isOpen;
	}

	get elements() {
		return { button: this.primitive.button, panel: this.primitive.panel };
	}

	get tuple(): [button: HTMLElement | undefined, panel: HTMLElement | undefined] {
		return [this.primitive.button, this.primitive.panel];
	}
}

export namespace Toggleable {
	export interface Options {
		Open?: Writable<boolean> | boolean;
		initialValue?: boolean;
		notifier?: (isOpen: boolean) => void;
	}
}
