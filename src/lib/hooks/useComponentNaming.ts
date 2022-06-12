import { LIBRARY_NAME } from '$lib/core';
import { isNumber } from '$lib/predicate';
import { clearWhiteSpace } from '$lib/utils';

export function useComponentNaming(configuration: {
	parent?: string | null;
	component: string;
	index: number;
}) {
	const { parent, component, index } = configuration;
	const clearedParent = parent ? clearWhiteSpace(parent) : parent
	let baseName = `${clearedParent || LIBRARY_NAME}-${component}-${index + 1}`;
	if (parent === null) baseName = `${component}-${index + 1}`;
	return {
		index,
		baseName,
		nameChild(component: string, index?: number) {
			if (isNumber(index)) return `${baseName}-${component}-${index + 1}`;
			return `${baseName}-${component}`;
		}
	};
}
