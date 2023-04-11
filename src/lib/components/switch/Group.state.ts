import Context from './Group.context';
import type { Writable } from 'svelte/store';
import { ElementBinder, ElementLabel, defineActionComponent } from '$lib/core';
import { useComponentNaming, useListener, useSwitch } from '$lib/hooks';
import { readonly, ref } from '$lib/utils';
import { hasTagName } from '$lib/predicate';

interface Settings {
	initialChecked: boolean; // ensures it has the right value in SSR
	isPassive: boolean;
}

export function createSwitchGroupState(settings: Settings) {
	const isChecked = useSwitch(settings.initialChecked);
	const isPassive = ref(settings.isPassive);
	const button = new ElementBinder();
	const descriptions = new ElementLabel();
	const labels = new ElementLabel();
	const { baseName, nameChild } = useComponentNaming('switch');
	button.name.set(baseName);

	Context.setContext({
		isChecked,
		isPassive,
		button,
		labels: labels.finalName,
		descriptions: descriptions.finalName,
		createSwitchDescription: createDescription,
		createSwitchLabel: createLabel
	});

	function createDescription(id: string | undefined, binder: ElementBinder) {
		return defineActionComponent({
			binder: binder,
			id: id,
			name: nameChild('description'),
			onInit: ({ name }) => {
				descriptions.onInitLabel(name, id);
			},
			onMount: ({ binder, name }) => {
				return descriptions.onMountLabel(name, binder);
			}
		});
	}

	function createLabel(id: string | undefined) {
		return defineActionComponent<Writable<boolean>>({
			id: id,
			name: nameChild('label'),
			onInit: ({ name }) => {
				labels.onInitLabel(name, id);
				return isPassive;
			},
			onMount: ({ binder, element, name }) => {
				return [
					labels.onMountLabel(name, binder),
					hasTagName(element, 'label') &&
						button.finalName.subscribe((id) => {
							if (id) element.for = id;
							else element.for = null;
						}),
					useListener(element, 'click', (event) => {
						event.preventDefault();
						if (button.disabled.value() || isPassive.value()) return;
						isChecked.toggle();
					})
				];
			}
		});
	}

	return { isChecked: readonly(isChecked), isPassive };
}
