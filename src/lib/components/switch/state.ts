import type { Readable, Updater, Writable } from 'svelte/store';
import type { ExtractContext } from '$lib/types';
import { type Activable, Bridge, Group, activable } from '$lib/stores';
import { Component, defineActionComponentWithParams } from '$lib/core';
import { GroupContext } from './Group.state';
import { makeReadable, setAttribute } from '$lib/utils';
import { useContext, useListener } from '$lib/hooks';
import { hasTagName, isObject } from '$lib/predicate';
import { onMount } from 'svelte';

export default class Switch extends Component {
	protected readonly Active: Activable;

	protected readonly Button = new Bridge();
	protected readonly Labels = new Group();
	protected readonly Descriptions = new Group();

	readonly Checked: Readable<boolean>;
	constructor(Settings: {
		Store: Writable<boolean> | boolean;
		initialValue: boolean;
		notifier: Updater<boolean>;
	}) {
		super({ component: 'switch', index: Switch.generateIndex() });
		this.Active = activable(Settings);
		this.Checked = makeReadable(this.Active);

		Switch.Context.setContext({
			Checked: this.Checked,
			button: this.button,
			initDescription: this.initDescription.bind(this),
			initLabel: this.initLabel.bind(this)
		});

		const groupContext = GroupContext.getContext(false);
		if (groupContext) {
			const { Checked, InitDescription, InitLabel } = groupContext;

			InitDescription.set(this.initDescription.bind(this));
			InitLabel.set(this.initLabel.bind(this));

			onMount(() => this.Checked.subscribe(Checked.set));
		}
	}

	get sync() {
		return this.Active.sync;
	}

	get toggle() {
		return this.Active.toggle;
	}

	get button() {
		return this.defineActionComponent({
			Bridge: this.Button,
			onMount: ({ element }) => {
				setAttribute(element, ['type', 'button'], {
					predicate: () => hasTagName(element, 'button')
				});
				element.setAttribute('role', 'switch');
				return this.nameChild('button');
			},
			destroy: ({ element }) => [
				this.Checked.subscribe((isChecked) => {
					element.ariaChecked = String(isChecked);
				}),
				this.Descriptions.Name.subscribe((id) => {
					if (id) element.setAttribute('aria-describedby', id);
					else element.removeAttribute('aria-describedby');
				}),
				this.Labels.Name.subscribe((id) => {
					if (id) element.setAttribute('aria-labelledby', id);
					else element.removeAttribute('aria-labelledby');
				}),
				useListener(element, 'click', this.toggle)
			]
		});
	}

	get description() {
		return this.initDescription({ Description: new Bridge() });
	}

	initDescription(this: Switch, { Description }: { Description: Bridge }) {
		return this.defineActionComponent({
			Bridge: Description,
			onMount: () => {
				const index = this.Descriptions.size;
				return this.nameChild({ name: 'description', index });
			},
			destroy: ({ element, name }) => this.Descriptions.add(element, name)
		});
	}

	get label() {
		return this.initLabel({ Label: new Bridge() });
	}

	initLabel(this: Switch, { Label }: { Label: Bridge }) {
		return defineActionComponentWithParams<boolean>({
			Bridge: Label,
			onMount: () => {
				const index = this.Labels.size;
				return this.nameChild({ name: 'label', index });
			},
			destroy: ({ element, name, parameter: passive }) => [
				this.Labels.add(element, name),
				useListener(element, 'click', () => {
					if (passive.value || this.Button.isDisabled) return;
					this.toggle();
				})
			]
		});
	}

	private static Context = useContext({
		component: 'switch',
		predicate: (val): val is Context =>
			isObject(val, ['Checked', 'button', 'initDescription', 'initLabel'])
	});

	static getContext = this.Context.getContext;

	private static generateIndex = this.initIndexGenerator();
}

type Context = ExtractContext<Switch, 'Checked' | 'button' | 'initDescription' | 'initLabel'>;
