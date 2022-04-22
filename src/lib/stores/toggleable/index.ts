import type { Store } from '$lib/types';
import type { Readable, Unsubscriber, Writable } from 'svelte/store';
import { focusFirstElement, makeUnique, setAttribute } from '$lib/utils';
import { hasTagName, isFocusable, isHTMLElement, isNullish, isWithin } from '$lib/predicate';
import { useCleanup, useCollector, useDataSync, useListener } from '$lib/hooks';
import { storable } from '$lib/stores/storable';
import { tick } from 'svelte';

export * from './handler';
export * from './plugin';

export class Toggleable {
	protected readonly Open: Store<boolean>;
	protected readonly FocusForce: Store<Readable<boolean>>;

	protected readonly primitive: {
		isFocusForced: boolean;
		isOpen: boolean;
		button?: HTMLElement;
		panel?: HTMLElement;
	} = {
		isFocusForced: false,
		isOpen: false
	};

	constructor(options: Expand<Toggleable.Options> = {}) {
		const { Open, initialValue = false, notifier, ForceFocus } = options;

		this.Open = storable({ Store: Open, initialValue, notifier });
		this.FocusForce = storable({ Store: ForceFocus, initialValue: false });
	}

	get subscribe() {
		return this.Open.subscribe;
	}

	get sync() {
		return this.Open.sync;
	}

	listen(this: Toggleable, button: HTMLElement, onChange?: (isOpen: boolean) => void) {
		const sync = useDataSync(this.primitive);
		return useCleanup(
			sync(this.FocusForce, 'isFocusForced'),
			sync(this.Open, 'isOpen', (isOpen) => {
				this.handleFocusForced(isOpen, button);
			}),
			onChange && this.Open.subscribe(onChange)
		);
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

	protected async handleFocusForced(isOpen: boolean, button: HTMLElement) {
		await tick();
		if (this.isFocusForced && isOpen && this.elements.panel) {
			focusFirstElement(this.elements.panel, { fallback: button });
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
			init: () => [this.listen(element, onChange), isToggler && this.handleClick(element)]
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

	get isFocusForced() {
		return this.primitive.isFocusForced;
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
		ForceFocus?: Readable<boolean>;
		Open?: Writable<boolean> | boolean;
		initialValue?: boolean;
		notifier?: (isOpen: boolean) => void;
	}
}
