import type { Store } from '$lib';
import type { Readable, Updater } from 'svelte/store';
import { Component } from '@core';
import { Bridge, storable, Toggleable } from '@stores';
import {
	handleClickOutside,
	handleEscapeKey,
	handleFocusLeave,
	usePreventInternalFocus
} from '@stores/toggleable';
import { makeReadable } from '@utils';
import { useContext, useListener } from '@hooks';
import { isObject } from '@predicate';

export default class Popover extends Component {
	protected readonly Toggleable: Toggleable;

	protected readonly Button = new Bridge();
	protected readonly Panel = new Bridge();
	protected readonly Overlay = new Bridge();

	readonly Open: Readable<boolean>;
	readonly ForceFocus: Store<Readable<boolean>>;

	constructor({ ForceFocus }: Options) {
		super({ component: 'popover', index: Popover.generateIndex() });
		this.ForceFocus = storable(ForceFocus);
		this.Toggleable = new Toggleable({ ForceFocus: this.ForceFocus });
		this.Open = makeReadable(this.Toggleable);

		Popover.Context.setContext({
			Open: this.Open,
			ForceFocus: this.ForceFocus,
			button: this.button,
			overlay: this.overlay,
			panel: this.panel,
			close: this.close
		});
	}

	get subscribe() {
		return this.Open.subscribe;
	}

	get close() {
		return this.Toggleable.close.bind(this.Toggleable);
	}

	get button() {
		return this.defineActionComponent({
			Bridge: this.Button,
			onMount: this.nameChild('button'),
			destroy: ({ element }) => [
				this.Toggleable.button(element, {
					onChange: (isOpen) => {
						element.ariaExpanded = String(isOpen);
					}
				}),
				this.Panel.Name.subscribe((id) => {
					if (id) element.setAttribute('aria-controls', id);
					else element.removeAttribute('aria-controls');
				})
			]
		});
	}

	get overlay() {
		return this.defineActionComponent({
			Bridge: this.Overlay,
			onMount: this.nameChild('overlay'),
			destroy: ({ element }) =>
				useListener(element, 'click', (event) => {
					if (event.target === element) this.Toggleable.close();
				})
		});
	}

	get panel() {
		return this.defineActionComponent({
			Bridge: this.Panel,
			onMount: this.nameChild('panel'),
			destroy: ({ element }) =>
				this.Toggleable.panel(element, {
					plugins: [usePreventInternalFocus],
					handlers: [handleClickOutside, handleEscapeKey, handleFocusLeave]
				})
		});
	}

	private static Context = useContext({
		component: 'popover',
		predicate: (val): val is Context =>
			isObject(val, ['Open', 'ForceFocus', 'button', 'panel', 'overlay'])
	});

	static getContext = this.Context.getContext;

	private static generateIndex = this.initIndexGenerator();
}

interface Options {
	ForceFocus: {
		Store: Readable<boolean> | boolean;
		initialValue: boolean;
		notifier: Updater<boolean>;
	};
}

type Context = ExtractContext<
	Popover,
	'Open' | 'ForceFocus' | 'button' | 'panel' | 'overlay' | 'close'
>;
