import Context from './Group.context';
import { ElementBinder, ElementLabel, defineActionComponent } from '$lib/core';
import { useComponentNaming } from '$lib/hooks';

export function createToolbarGroupState() {
	const { baseName, nameChild } = useComponentNaming({ name: 'toolbar' });
	const labels = new ElementLabel();
	const toolbar = new ElementBinder();
	toolbar.name.set(baseName);

	Context.setContext({ createToolbarLabel, labels, toolbar });

	function createToolbarLabel(id: string | undefined, binder: ElementBinder) {
		return defineActionComponent({
			id: id,
			name: nameChild('label'),
			onInit({ name }) {
				labels.onInitLabel(name, id);
				return toolbar.finalName;
			},
			onMount({ name }) {
				return labels.onMountLabel(name, binder);
			}
		});
	}
}
