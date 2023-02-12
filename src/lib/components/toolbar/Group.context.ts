import type { ElementBinder, ElementLabel } from '$lib/core';
import type { Readable } from 'svelte/store';
import type { ComponentInitialiserStrict } from '$lib/types';
import { useContext } from '$lib/hooks';
import { isElementBinder, isElementLabel, isFunction, isInterface } from '$lib/predicate';

interface Context {
	createToolbarLabel: ComponentInitialiserStrict<Readable<string | undefined>>;
	labels: ElementLabel;
	toolbar: ElementBinder;
}

export default useContext({
	component: 'toolbar',
	predicate: (context): context is Context =>
		isInterface<Context>(context, {
			createToolbarLabel: isFunction,
			labels: isElementLabel,
			toolbar: isElementBinder
		})
});
