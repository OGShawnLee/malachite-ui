import type { Readable, Writable } from 'svelte/store';
import type { ExtractContext, Nullable } from '$lib/types';
import { Component } from '$lib/core';
import { Bridge, Toggleable } from '$lib/stores';
import { makeReadable } from '$lib/utils';
import { useContext } from '$lib/hooks';
import { isBoolean, isObject } from '$lib/predicate';

export default class Disclosure extends Component {
	protected readonly Toggleable: Toggleable;

	protected readonly Button: Bridge;
	protected readonly Panel: Bridge;

	readonly Open: Readable<boolean>;
	constructor({ MasterDisabled, Open }: Expand<Configuration>) {
		super({ component: 'disclosure', index: Disclosure.generateIndex() });
		this.Toggleable = new Toggleable({ Open: Open.Store, ...Open });

		this.Button = new Bridge(({ Disabled }) => [
			MasterDisabled.subscribe((isDisabled) => {
				if (isBoolean(isDisabled)) Disabled.set(isDisabled);
			})
		]);
		this.Panel = new Bridge(({ Disabled }) => {
			MasterDisabled.subscribe((isDisabled) => {
				if (isBoolean(isDisabled)) Disabled.set(isDisabled);
			});
		});

		this.Open = makeReadable(this.Toggleable);

		CONTEXT.setContext({
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
			destroy: ({ element }) => this.Toggleable.panel(element)
		});
	}

	private static generateIndex = this.initIndexGenerator();
}

export const CONTEXT = useContext({
	component: 'disclosure',
	predicate: (val): val is Context => isObject(val, ['Open', 'button', 'panel', 'close'])
});

interface Configuration {
	MasterDisabled: Readable<Nullable<boolean>>;
	Open: {
		Store: Writable<boolean> | boolean;
		initialValue: boolean;
		notifier: (isOpen: boolean) => void;
	};
}

type Context = ExtractContext<Disclosure, 'Open' | 'button' | 'panel' | 'close'>;
