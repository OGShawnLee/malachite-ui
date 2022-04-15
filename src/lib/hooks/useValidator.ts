import type { Readable } from 'svelte/store';
import { derived } from 'svelte/store';

export function useValidator<T>(Main: Readable<T>, Validator: Readable<unknown>, useFalse = false) {
	const MainLoop = derived([Main, Validator], ([$Main, $Validator]) => {
		return [$Main, $Validator] as [T, boolean];
	});

	if (useFalse) {
		return function (callback: (main: T) => void) {
			return MainLoop.subscribe(([main, valid]) => {
				if (!valid) callback(main);
			});
		};
	}

	return function (callback: (main: T) => void) {
		return MainLoop.subscribe(([main, valid]) => {
			if (valid) callback(main);
		});
	};
}
