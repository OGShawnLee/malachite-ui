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

export function handleFocusLeave(this: Toggleable, panel: HTMLElement) {
	return useWindowListener('focusin', (event) => {
		if (this.isClosed || event.target === window || event.target === document.body) return;
		if (this.isFocusForced && !isWithin(panel, event.target)) return this.close(event);
		if (isWithin(this.tuple, event.target)) return;

		this.close(event);
	});
}
