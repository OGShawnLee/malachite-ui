import type { Navigation } from '$lib/types';
import GroupContext from './Group.context';
import Context from './context';
import { Navigable } from '$lib/stores';
import { ElementBinder, defineActionComponent } from '$lib/core';
import { useComponentNaming } from '$lib/hooks';
import { handleAriaOrientation } from '$lib/plugins';
import { createReadableRef } from '$lib/utils';

export function createToolbarState(settings: Navigation.Settings) {
	const group = GroupContext.getContext(false);
	const navigation = new Navigable(settings);
	const { baseName, nameChild } = useComponentNaming({
		name: 'toolbar',
		parent: group?.toolbar.name.value
	});

	Context.setContext({
		createToolbarItem,
		item,
		isVertical: createReadableRef(navigation.isVertical)
	});

	function createToolbar(id: string | undefined) {
		return defineActionComponent({
			id: id,
			name: baseName,
			binder: group?.toolbar,
			onInit() {
				return group?.labels.finalName;
			},
			onMount({ element }) {
				element.role = 'toolbar';
				element.tabIndex = -1;
				return [
					navigation.initNavigation(element, {
						plugins: [handleAriaOrientation]
					}),
					group?.labels.handleAriaLabelledby(element)
				];
			}
		});
	}

	function createToolbarItem(id: string | undefined, binder: ElementBinder) {
		return defineActionComponent({
			id: id,
			name: nameChild('item'),
			binder: binder,
			onInit({ binder, name }) {
				navigation.onInitItem(name, binder, {});
			},
			onMount({ element, name }) {
				return navigation.initItem(element, name);
			}
		});
	}

	function item(element: HTMLElement) {
		return navigation.createQuickItem(element);
	}

	return { navigation, createToolbar };
}
