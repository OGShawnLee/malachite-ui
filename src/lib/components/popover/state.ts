import type Group from './Group.state';
import type { ExtractContext } from '$lib/types';
import type { Store } from '$lib/types';
import { type Readable, type Updater, readable } from 'svelte/store';
import { GroupContext } from './Group.state';
import { Component } from '$lib/core';
import { Bridge, storable, Toggleable } from '$lib/stores';
import {
	handleClickOutside,
	handleEscapeKey,
	handleFocusLeave,
	usePreventInternalFocus
} from '$lib/stores/toggleable';
import { makeReadable } from '$lib/utils';
import { useContext, useListener } from '$lib/hooks';
import { isObject } from '$lib/predicate';

export default class Popover extends Component {
	protected readonly Toggleable: Toggleable;

	protected readonly Button = new Bridge();
	protected readonly Panel = new Bridge();
	protected readonly Overlay = new Bridge();

	readonly Open: Readable<boolean>;
	readonly ShowOverlay = readable(true, (set) => {
		if (this.groupClient) {
			return this.groupClient.Mode.subscribe((mode) => {
				set(mode === 'UNIQUE');
			});
		}
	});
	readonly ForceFocus: Store<Readable<boolean>>;
	readonly groupClient: ReturnType<Group['initClient']> | undefined;

	constructor({ ForceFocus }: Options) {
		super({ component: 'popover', index: Popover.generateIndex() });
		this.ForceFocus = storable(ForceFocus);
		this.Toggleable = new Toggleable({ ForceFocus: this.ForceFocus });
		this.Open = makeReadable(this.Toggleable);

		this.groupClient = GroupContext.getContext(false)?.initClient(this.Toggleable);

		Popover.Context.setContext({
			Open: this.Open,
			ForceFocus: this.ForceFocus,
			ShowOverlay: this.ShowOverlay,
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
				}),
				this.groupClient?.button(element)
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
			destroy: ({ element }) => [
				this.Toggleable.panel(element, {
					plugins: [usePreventInternalFocus],
					handlers: this.groupClient ? [] : [handleClickOutside, handleEscapeKey, handleFocusLeave]
				}),
				this.groupClient?.panel(element)
			]
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
	'Open' | 'ForceFocus' | 'ShowOverlay' | 'button' | 'panel' | 'overlay' | 'close'
>;
