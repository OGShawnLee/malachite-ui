import { LIBRARY_NAME } from '$lib/core';
import { isEmpty, isString } from '$lib/predicate';
import { clearString } from '$lib/utils';
import { nanoid } from 'nanoid';

const UID_LENGTH = 8;

export function useComponentNaming({ name, parent }: { name: string; parent?: string }) {
	if (isString(parent) && isEmpty(parent)) throw Error('parent must not be an empty string.');
	if (isEmpty(name)) throw Error('name must not be an empty string.');

	const uid = nanoid(UID_LENGTH);
	parent = parent ? separateWithDashes(parent) : parent;
	name = separateWithDashes(name);
	let baseName = `${parent || LIBRARY_NAME}-${name}-${uid}`;
	if (parent === null) baseName = `${name}-${uid}`;
	return {
		baseName,
		nameChild(childName: string) {
			if (isEmpty(childName)) throw new Error('childName must not be an empty string.');

			const uid = nanoid(UID_LENGTH);
			childName = separateWithDashes(childName);
			return `${baseName}-${childName}-${uid}`;
		}
	};
}

function separateWithDashes(str: string) {
	return clearString(str).replace(/\s/, '-');
}
