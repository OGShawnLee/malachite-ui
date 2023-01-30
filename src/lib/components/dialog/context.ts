import type { Readable } from 'svelte/store';
import type { ComponentInitialiser, ComponentInitialiserStrict } from '$lib/types';
import type { Toggleable } from '$lib/stores';
import { useContext } from '$lib/hooks';
import { isFunction, isInterface, isStore } from '$lib/predicate';

interface Context {
	isOpen: Readable<boolean>;
	close: OmitThisParameter<Toggleable['close']>;
	createDialogContent: ComponentInitialiser;
	createDialogDescription: ComponentInitialiserStrict;
	createDialogTitle: ComponentInitialiserStrict;
	createDialogOverlay: ComponentInitialiser;
}

export default useContext({
	component: 'dialog',
	predicate: (context): context is Context =>
		isInterface<Context>(context, {
			isOpen: isStore,
			close: isFunction,
			createDialogContent: isFunction,
			createDialogDescription: isFunction,
			createDialogTitle: isFunction,
			createDialogOverlay: isFunction
		})
});
