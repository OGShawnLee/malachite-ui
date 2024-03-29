import { getContext, hasContext, setContext } from 'svelte';
import { LIBRARY_NAME } from '$lib/core';

export default function useContext<C>(configuration: {
	component: string;
	predicate: (value: unknown) => value is C;
}) {
	const { component, predicate } = configuration;
	const name = getContextKey(component);
	return {
		getContext: <T extends boolean = true>(
			strict = true as T
		): [T] extends [true] ? C : C | undefined => {
			if (strict && !hasContext(name))
				throw new Error(`Unable to Find ${name} Context. Did you set it?`);

			const value = getContext(name);

			if (predicate(value)) return value;
			else if (strict || value !== undefined) throw new Error(`Invalid ${name} Context`);

			return undefined as [T] extends [true] ? C : C | undefined;
		},
		hasContext() {
			return hasContext(name);
		},
		setContext: (value: C) => {
			setContext(name, value);
			return value;
		}
	};
}

function coolString(str: string) {
	return str
		.trim()
		.replace(/\s+/g, '-')
		.split('-')
		.map((str) => str[0].toUpperCase() + str.substring(1))
		.join('-');
}

export function getContextKey(component: string) {
	return coolString(`${LIBRARY_NAME}-${component}`);
}
