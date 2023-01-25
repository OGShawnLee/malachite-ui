import type { Nullable } from '$lib/types';
import { createDerivedRef, createReadableRef, ref } from '$lib/utils';
import { useCollector, usePair } from '$lib/hooks';
import { isDisabled, isString, isValidHTMLElementID } from '$lib/predicate';

/*
	id: id provided by the user
	name: unique id provided by the library
	finalName: derived of id and name -> if id is nullish or invalid it defaults to name 
*/

export default class ElementBinder {
	readonly disabled = ref<Nullable<boolean>>(undefined);
	protected readonly node = ref<HTMLElement | undefined>(undefined);
	readonly name = ref<string | undefined>(undefined);
	readonly id = ref<string | undefined>(undefined);
	readonly isActive = ref(false);
	readonly isSelected = ref(false);
	readonly isUsingFragment = ref(true);
	readonly finalName = createDerivedRef([this.id, this.name], ([id, name]) => {
		return isString(id) && isValidHTMLElementID(id) ? id : name;
	});

	get element() {
		return createReadableRef(this.node);
	}

	onMount(this: ElementBinder, element: HTMLElement, name: string) {
		this.node.value = element;
		this.disabled.value = isDisabled(element);
		this.name.value = name;
		this.id.value = element.id;
		return useCollector({
			beforeCollection: () => {
				this.node.value = undefined;
				this.name.value = undefined;
				this.id.value = undefined;
			},
			init: () => [
				this.isUsingFragment.value &&
					usePair(this.element, this.finalName, (element, id) => {
						if (element && id) element.id = id;
					})
			]
		});
	}
}
