import type Switch from './state';
import { get, writable } from 'svelte/store';
import { useContext } from '$lib/hooks';
import { isObject } from '$lib/predicate';
import { Bridge } from '$lib/stores';

export default class Group {
	readonly Checked = writable(false);
	readonly InitDescription = writable<OmitThisParameter<Switch['initDescription']>>();
	readonly InitLabel = writable<OmitThisParameter<Switch['initLabel']>>();

	constructor() {
		GroupContext.setContext({
			Checked: this.Checked,
			InitDescription: this.InitDescription,
			InitLabel: this.InitLabel,
			initDescription: this.initDescription.bind(this),
			initLabel: this.initLabel.bind(this)
		});
	}

	get description() {
		return this.initDescription({ Description: new Bridge() });
	}

	initDescription(this: Group, { Description }: { Description: Bridge }) {
		return {
			Proxy: Description,
			action: (element: HTMLElement) => {
				const initDescription = get(this.InitDescription);
				return initDescription({ Description }).action(element);
			}
		};
	}

	get label() {
		return this.initLabel({ Label: new Bridge() });
	}

	initLabel(this: Group, { Label }: { Label: Bridge }) {
		return {
			Proxy: Label,
			action: (element: HTMLElement, passive = false) => {
				const initLabel = get(this.InitLabel);
				return initLabel({ Label }).action(element, passive);
			}
		};
	}
}

export const GroupContext = useContext({
	component: 'switch-group',
	predicate: (val): val is Context =>
		isObject(val, ['Checked', 'InitDescription', 'InitLabel', 'initDescription', 'initLabel'])
});

type Context = ExtractContext<
	Group,
	'Checked' | 'InitDescription' | 'InitLabel' | 'initDescription' | 'initLabel'
>;
