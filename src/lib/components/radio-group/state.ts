import type { Navigation } from '$lib/types';
import ToolbarContext from '../toolbar/context';
import { GroupContext, OptionContext } from './context';
import { ElementBinder, ElementLabel, defineActionComponent } from '$lib/core';
import { Navigable } from '$lib/stores';
import { useComponentNaming, usePair } from '$lib/hooks';
import { ref } from '$lib/utils';
import { getRadioGroupNavigationHandler } from '$lib/plugins';

interface Settings<T> extends Navigation.Settings {
	initialValue: T;
}

interface Item<T> extends Navigation.Item {
	value: T;
}

export function createRadioGroupState<T>(settings: Settings<T>) {
	const toolbar = ToolbarContext.getContext(false);
	settings.isManual = ToolbarContext.hasContext();

	const descriptions = new ElementLabel();
	const globalValue = ref(settings.initialValue);
	const navigation = new Navigable<Item<T>>(settings);
	const labels = new ElementLabel();
	const radioGroup = new ElementBinder();
	const { baseName, nameChild } = useComponentNaming('radio-group');
	let isInitialValueFound = false;

	GroupContext.setContext({
		parentName: radioGroup.finalName,
		labels,
		descriptions,
		createRadioGroupDescription,
		createRadioGroupLabel,
		createRadioGroupOptionState
	});

	function createRadioGroup(id: string | undefined) {
		return defineActionComponent({
			binder: radioGroup,
			id: id,
			name: baseName,
			onMount({ element }) {
				element.role = 'radiogroup';
				return [
					navigation.initNavigation(element, {
						handler: getRadioGroupNavigationHandler(toolbar)
					}),
					descriptions.handleAriaDescribedby(element),
					labels.handleAriaLabelledby(element)
				];
			}
		});
	}

	function createRadioGroupDescription(id: string | undefined, binder: ElementBinder) {
		const { descriptions } = getDescriptionContext();
		return defineActionComponent({
			id: id,
			binder: binder,
			name: nameChild('description'),
			onInit({ name }) {
				descriptions.onInitLabel(name, id);
			},
			onMount({ binder, name }) {
				return descriptions.onMountLabel(name, binder);
			}
		});
	}

	function createRadioGroupLabel(id: string | undefined, binder: ElementBinder) {
		const { labels, parentName } = getDescriptionContext();
		return defineActionComponent({
			id: id,
			binder: binder,
			name: nameChild('label'),
			onInit({ name }) {
				labels.onInitLabel(name, id);
			},
			onMount({ element, binder, name }) {
				return [
					labels.onMountLabel(name, binder),
					parentName.subscribe((name) => {
						if (name) element.for = name;
						else element.for = null;
					})
				];
			}
		});
	}

	function createRadioGroupOptionState(initialValue: T, isSelected: boolean) {
		const descriptions = new ElementLabel();
		const labels = new ElementLabel();
		const option = new ElementBinder();
		
		OptionContext.setContext({ labels, descriptions, parentName: option.finalName });

		function createRadioGroupOption(id: string | undefined) {
			return defineActionComponent({
				binder: option,
				id: id,
				name: nameChild("option"),
				onInit: ({ binder, name }) => {
					const index = navigation.onInitItem(name, binder, { value: initialValue });
					if (isInitialValueFound) return;
					if (initialValue === globalValue.value() || isSelected) {
						navigation.index.set(index);
						navigation.isWaiting.set(false);
						navigation.hasSelected.set(true);
						isInitialValueFound = true;
					}
				},
				onMount({ element, name }) {
					element.tabIndex = 0;
					element.role = 'radio';
					return [
						toolbar?.item(element),
						navigation.initItem(element, name),
						descriptions.handleAriaDescribedby(element),
						labels.handleAriaLabelledby(element),
						usePair(option.disabled, option.isSelected, (isDisabled, isSelected) => {
							element.tabIndex = isDisabled ? -1 : isSelected ? 0 : -1;
						}),
						option.isSelected.subscribe((isSelected) => {
							if (isSelected) {
								globalValue.set(initialValue);
								element.ariaChecked = 'true';
							} else element.ariaChecked = 'false';
						})
					];
				}
			});
		}

		return {
			createRadioGroupOption,
			descriptions: descriptions.finalName,
			labels: labels.finalName
		};
	}

	return {
		createRadioGroup,
		descriptions: descriptions.finalName,
		globalValue,
		labels: labels.finalName,
		navigation
	};
}

function getDescriptionContext() {
	const { descriptions, labels, parentName } =
		OptionContext.getContext(false) || GroupContext.getContext();
	return { descriptions, labels, parentName };
}
