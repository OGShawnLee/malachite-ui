import Context from './Group.context';
import { ElementBinder, defineActionComponent } from '$lib/core';
import { useComponentNaming, useListener, useSwitch } from '$lib/hooks';
import { isDisabled } from '$lib/predicate'

export function createSwitchState(initialValue: boolean) {
	const { isChecked, button, descriptions, labels } = handleGroupContext(initialValue);
	const { baseName } = useComponentNaming({
		name: 'switch',
		overwriteWith: button.name.value()
	});

	function createSwitch(id: string | undefined) {
		return defineActionComponent({
			binder: button,
			id: id,
			name: baseName,
			onMount: ({ element }) => {
				element.role = 'switch';
				return [
					isChecked.subscribe((isChecked) => {
						element.ariaChecked = '' + isChecked;
					}),
					descriptions?.subscribe((id) => {
						if (id) element.setAttribute('aria-describedby', id);
						else element.removeAttribute('aria-describedby');
					}),
					labels?.subscribe((id) => {
						if (id) element.setAttribute('aria-labelledby', id);
						else element.removeAttribute('aria-labelledby');
					}),
					useListener(element, 'click', () => {
						if (isDisabled(element)) return
						isChecked.toggle()
					})
				];
			}
		});
	}

	return { isChecked, createSwitch, descriptions, labels };
}

function handleGroupContext(initialValue: boolean) {
	const groupContext = Context.getContext(false);

	if (groupContext) {
		const { isChecked, button, descriptions, labels } = groupContext;
		isChecked.set(initialValue);
		return { isChecked, button, descriptions, labels };
	}

	const isChecked = useSwitch(initialValue);
	const button = new ElementBinder();
	return { isChecked, button };
}
