import type { ComponentInitialiser, ComponentInitialiserStrict, Navigation } from '$lib/types';
import { Navigable } from '$lib/stores';
import { defineActionComponent } from '$lib/core';
import { useComponentNaming, useContext } from '$lib/hooks';
import { useResetOnLeave } from '$lib/plugins';
import { isFunction, isInterface } from '$lib/predicate';

export function createNavigableState(settings: Navigation.Settings) {
	const navigation = new Navigable(settings);
	const { baseName, nameChild } = useComponentNaming('navigable');

	const createNavigable: ComponentInitialiser = (id) =>
		defineActionComponent({
			id: id,
			name: baseName,
			onMount: ({ element }) =>
				navigation.initNavigation(element, {
					plugins: [useResetOnLeave]
				})
		});

	const createNavigableItem: ComponentInitialiserStrict = (id, binder) =>
		defineActionComponent({
			binder: binder,
			id: id,
			name: nameChild('item'),
			onInit: ({ binder, name }) => {
				navigation.onInitItem(name, binder, {});
			},
			onMount: ({ element, name }) => navigation.initItem(element, name)
		});

	setContext({ createNavigableItem });
	return { createNavigable, navigation };
}

interface Context {
	createNavigableItem: ComponentInitialiserStrict;
}

const { getContext, setContext } = useContext({
	component: 'navigable',
	predicate: (context): context is Context =>
		isInterface<Context>(context, {
			createNavigableItem: isFunction
		})
});

export { getContext };
