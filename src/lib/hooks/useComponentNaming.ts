import type { Expand } from '$lib/types';
import { LIBRARY_NAME } from '$lib/core';
import { isEmpty, isNumber, isString } from '$lib/predicate';
import { clearString } from '$lib/utils';

interface Options {
	parent?: string | null;
	name: string;
	index: number;
}

export function useComponentNaming({ parent, name, index }: Expand<Options>): {
	baseName: string;
	index: number;
	nameChild(childName: string, index?: number): string;
} {
	if (isString(parent) && isEmpty(parent)) throw Error('parent must not be an empty string.');
	if (isEmpty(name)) throw Error('name must not be an empty string.');

	parent = parent ? separateWithDashes(parent) : parent;
	name = separateWithDashes(name);
	let baseName = `${parent || LIBRARY_NAME}-${name}-${index}`;
	if (parent === null) baseName = `${name}-${index}`;
	return {
		baseName,
		index,
		nameChild(childName: string, index?: number) {
			if (isEmpty(childName)) throw new Error('childName must not be an empty string.');

			childName = separateWithDashes(childName);
			if (isNumber(index)) return `${baseName}-${childName}-${index}`;
			return `${baseName}-${childName}`;
		}
	};
}

function separateWithDashes(str: string) {
	return clearString(str).replace(/\s/, '-');
}
