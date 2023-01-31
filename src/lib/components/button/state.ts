import { defineActionComponent } from '$lib/core';
import { useComponentNaming, useListener } from '$lib/hooks';
import { ref } from '$lib/utils';

export function createButtonState(initialValue: boolean) {
	const isPressed = ref(initialValue);
	const { baseName } = useComponentNaming('button');

	function createButton(id: string | undefined) {
		return defineActionComponent({
			id: id,
			name: baseName,
			onMount({ element }) {
				element.role = 'button';
				element.setAttribute('type', 'button');
				return [
					useListener(element, 'click', () => {
						isPressed.update((isPressed) => !isPressed);
					}),
					isPressed.subscribe((isPressed) => {
						element.ariaPressed = '' + isPressed;
					})
				];
			}
		});
	}

	return { isPressed, createButton };
}
