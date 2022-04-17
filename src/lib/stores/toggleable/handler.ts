import type { Toggleable } from '@stores';
import { useWindowListener } from '$lib/hooks';
import { isWithin } from '$lib/predicate';

export function handleClickOutside(this: Toggleable) {
	return useWindowListener('click', (event) => {
		if (this.isClosed || isWithin(this.tuple, event.target)) return;
		this.close(event);
	});
}

export function handleEscapeKey(this: Toggleable) {
	return useWindowListener('keydown', (event) => {
		if (this.isOpen && event.code === 'Escape') this.close(event);
	});
}

export function handleFocusLeave(this: Toggleable) {
	return useWindowListener('focusin', (event) => {
		if (event.target === window) return;
		if (event.target === document.body || this.isClosed || isWithin(this.tuple, event.target))
			return;

		this.close(event);
	});
}
