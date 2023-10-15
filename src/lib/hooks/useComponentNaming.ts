import type { Expand } from '$lib/types';
import { clearString } from '$lib/utils';
import { isEmpty, isObject, isString } from '$lib/predicate';
import { nanoid } from 'nanoid';
import { LIBRARY_NAME } from '$lib/core';

const UID_LENGTH = 8;

interface Settings {
	name: string;
	parent?: string;
	overwriteWith?: string;
}

export default function useComponentNaming(name: string | Expand<Settings>) {
	const finalName = isString(name) ? name : name.name;
	const parent = isString(name) ? undefined : name.parent;
	let baseName = getUniqueName(finalName, 'component', parent);
	if (isObject(name) && name.overwriteWith) baseName = name.overwriteWith;

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
