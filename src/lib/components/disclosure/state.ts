import type { Readable, Writable } from 'svelte/store';
import type { Expand, ExtractContext } from '$lib/types';
import { Component } from '$lib/core';
import { Bridge, Toggleable, usePreventInternalFocus } from '$lib/stores';
import { makeReadable } from '$lib/utils';
import { useContext } from '$lib/hooks';
import { isActionComponent, isFunction, isInterface, isStore } from '$lib/predicate';

export default class Disclosure extends Component {
	protected readonly Toggleable: Toggleable;

	protected readonly Button = new Bridge();
	protected readonly Panel = new Bridge();

	readonly Open: Readable<boolean>;
	constructor({ Open }: Expand<Configuration>) {
		super({ component: 'disclosure', index: Disclosure.generateIndex() });
		this.Toggleable = new Toggleable({ Open: Open.Store, ...Open });

		this.Open = makeReadable(this.Toggleable);

		Context.setContext({
			Open: this.Open,
			button: this.button,
			panel: this.panel,
			close: this.close
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

	get button() {
		return this.defineActionComponent({
			Bridge: this.Button,
			onMount: this.nameChild('button'),
			destroy: ({ element }) => [
				this.Toggleable.button(element, {
					onChange: (isOpen) => (element.ariaExpanded = String(isOpen))
				}),
				this.Panel.Name.subscribe((id) => {
					if (id) element.setAttribute('aria-controls', id);
					else element.removeAttribute('aria-controls');
				})
			]
		});
	}

	get panel() {
		return this.defineActionComponent({
			Bridge: this.Panel,
			onMount: this.nameChild('panel'),
			destroy: ({ element }) =>
				this.Toggleable.panel(element, {
					plugins: [usePreventInternalFocus]
				})
		});
	}

	private static generateIndex = this.initIndexGenerator();
}

export const Context = useContext({
	component: 'disclosure',
	predicate: (val): val is Context =>
		isInterface<Context>(val, {
			Open: isStore,
			button: isActionComponent,
			panel: isActionComponent,
			close: isFunction
		})
});

interface Configuration {
	Open: {
		Store: Writable<boolean> | boolean;
		initialValue: boolean;
		notifier: (isOpen: boolean) => void;
	};
}

type Context = ExtractContext<Disclosure, 'Open' | 'button' | 'panel' | 'close'>;
