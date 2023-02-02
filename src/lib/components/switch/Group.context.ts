import type { Readable, Writable } from 'svelte/store';
import type { ComponentInitialiserStrict, Switch } from '$lib/types';
import type { ElementBinder } from '$lib/core';
import { useContext } from '$lib/hooks';
import { isElementBinder, isFunction, isInterface, isStore, isWritable } from '$lib/predicate';

interface Context {
	isChecked: Switch;
	isPassive: Writable<boolean>;
	button: ElementBinder;
	descriptions: Readable<string | undefined>;
	labels: Readable<string | undefined>;
	createSwitchDescription: ComponentInitialiserStrict;
	createSwitchLabel: ComponentInitialiserStrict<Writable<boolean>>;
}

export default useContext<Context>({
	component: 'switch-group',
	predicate: (context): context is Context =>
		isInterface<Context>(context, {
			isChecked(value): value is Switch {
				return isWritable(value);
			},
			isPassive: isWritable,
			button: isElementBinder,
			descriptions: isStore,
			labels: isStore,
			createSwitchDescription: isFunction,
			createSwitchLabel: isFunction
		})
});
