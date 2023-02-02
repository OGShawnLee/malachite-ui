import type { ComponentInitialiser, ComponentInitialiserStrict, Nullable } from '$lib/types';
import type { Readable } from 'svelte/store';
import { useContext } from '$lib/hooks';
import { isFunction, isInterface, isStore } from '$lib/predicate';

interface Context<T> {
	isOpen: Readable<boolean>;
	createListboxButton: ComponentInitialiser;
	createListboxLabel: ComponentInitialiserStrict<Readable<string | undefined>>;
	createListboxOptionState(
		initialValue: T,
		isDisabled: Nullable<boolean>
	): {
		createListboxOption: ComponentInitialiserStrict;
	};
	createListboxPanel: ComponentInitialiser;
}

export default useContext({
	component: 'listbox',
	predicate: (context): context is Context<any> =>
		isInterface<Context<any>>(context, {
			isOpen: isStore,
			createListboxButton: isFunction,
			createListboxLabel: isFunction,
			createListboxOptionState: isFunction,
			createListboxPanel: isFunction
		})
});
