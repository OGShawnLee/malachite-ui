import { clearString } from '$lib/utils';
import { isEmpty } from '$lib/predicate';
import { nanoid } from 'nanoid';
import { LIBRARY_NAME } from '$lib/core';

const UID_LENGTH = 8;

export function useComponentNaming(name: string) {
	const baseName = getUniqueName(name, 'component');

	function nameChild(name: string) {
		return getUniqueName(name, 'child', baseName);
	}

	return { baseName, nameChild };
}

function clearAndSeparateWithDashes(str: string) {
	return clearString(str).replace(/\s/, '-');
}

function getUniqueName(name: string, type: string, parent?: string) {
	name = clearAndSeparateWithDashes(name);
	const uid = nanoid(UID_LENGTH);

	if (parent) {
		return isEmpty(name) ? `${parent}-${type}-${uid}` : `${parent}-${name}-${uid}`;
	}

	return isEmpty(name) ? `${LIBRARY_NAME}-${type}-${uid}` : `${LIBRARY_NAME}-${name}-${uid}`;
}
