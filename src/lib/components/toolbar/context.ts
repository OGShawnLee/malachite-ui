import type { Unsubscriber } from 'svelte/store';
import type { ComponentInitialiserStrict, ReadableRef } from '$lib/types';
import { useContext } from '$lib/hooks';
import { isFunction, isInterface, isReadableRef } from '$lib/predicate';

interface Context {
	createToolbarItem: ComponentInitialiserStrict;
	item(element: HTMLElement): Unsubscriber;
	isVertical: ReadableRef<boolean>;
}

export default useContext({
	component: 'toolbar',
	predicate: (context): context is Context =>
		isInterface<Context>(context, {
			createToolbarItem: isFunction,
			item: isFunction,
			isVertical: isReadableRef
		})
});
