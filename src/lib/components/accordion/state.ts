import type { Navigation } from '$lib/types';
import { Toggleable, ToggleableGroup } from '$lib/stores';
import { GroupContext, ItemContext } from './context';
import { Navigable } from '$lib/stores';
import { ElementBinder, defineActionComponent } from '$lib/core';
import { useComponentNaming } from '$lib/hooks';
import { createReadableRef } from '$lib/utils';
import {
	handleAriaControls,
	handleAriaDisabled,
	handleAriaExpanded,
	handleAriaLabelledby
} from '$lib/plugins';

interface Settings extends Navigation.Settings {
	isUnique: boolean;
}

export function createAccordionState(settings: Settings) {
	const navigation = new Navigable(settings);
	const group = new ToggleableGroup(settings.isUnique);
	const { baseName } = useComponentNaming('accordion');

	GroupContext.setContext({
		createAccordionItemState: createItemState
	});

	function createAccordion(id: string | undefined) {
		return defineActionComponent({
			id: id,
			name: baseName,
			onMount: ({ element }) => navigation.initNavigation(element)
		});
	}

	function createItemState() {
		const { nameChild } = useComponentNaming({ name: 'item', parent: baseName });
		const button = new ElementBinder();
		const buttonName = nameChild('button');
		const header = new ElementBinder();
		const panel = new ElementBinder();
		const toggler = new Toggleable({ group });

		ItemContext.setContext({
			isOpen: createReadableRef(toggler.isOpen),
			button,
			close: toggler.close.bind(toggler),
			panel,
			createAccordionButton: createButton,
			createAccordionHeading: createHeading,
			createAccordionPanel: createPanel
		});

		function createButton(id: string | undefined) {
			return defineActionComponent({
				id: id,
				binder: button,
				name: buttonName,
				onInit: ({ name }) => {
					navigation.onInitItem(name, button, {});
				},
				onMount({ element, name }) {
					return [
						navigation.initItem(element, name),
						toggler.createButton(element, {
							plugins: [handleAriaExpanded, handleAriaControls(panel), handleAriaDisabled(button)]
						})
					];
				}
			});
		}

		function createHeading(id: string | undefined) {
			return defineActionComponent({
				id: id,
				binder: header,
				name: nameChild('header'),
				onMount: () => {
					// TODO: HANDLE ATTRIBUTES IF ELEMENT IS NOT A NATIVE HEADING
				}
			});
		}

		function createPanel(id: string | undefined) {
			return defineActionComponent({
				id: id,
				binder: panel,
				name: nameChild('panel'),
				isShowing: toggler.isOpen.value,
				onMount({ element }) {
					element.setAttribute('role', 'region');
					return toggler.createPanel(element, {
						plugins: [handleAriaLabelledby(button)]
					});
				}
			});
		}

		return {
			isOpen: createReadableRef(toggler.isOpen),
			close: toggler.close.bind(toggler),
			button: createButton('').action,
			heading: createHeading('').action,
			panel: createPanel('').action
		};
	}

	return { createAccordion, navigation, isOpen: group.isOpen, isUnique: group.isUnique };
}
