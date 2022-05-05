import type { Expand, Navigable, Store } from '$lib/types';
import type { Readable, Writable } from 'svelte/store';
import { type Ordered, storable } from '$lib/stores';
import { derived, writable } from 'svelte/store';

type Member = Expand<Navigable.Member>;
type Options<T> = Expand<Navigable.Options<T>>

export default class Initialiser<T> {
	protected readonly Index: Store<number>;
	protected readonly Manual: Readable<boolean>;
	protected readonly ManualIndex: Writable<number>;
	protected readonly Ordered: Ordered<T & Member>;
	protected readonly Vertical: Readable<boolean>;
	protected TargetIndex: Writable<number>;

	readonly Active: Readable<undefined | [HTMLElement, T & Member]>;
	readonly Selected: Readable<undefined | [HTMLElement, T & Member]>;

	protected readonly primitive: Expand<Navigable.Primitive<T>> = {
		active: undefined,
		elements: [],
		index: 0,
		isManual: false,
		isVertical: false,
		manualIndex: 0,
		selected: undefined
	};

	constructor({ Index, Manual, Vertical, Ordered }: Options<T>) {
		this.Index = storable({ Store: Index, initialValue: 0 });
		this.Manual = storable({ Store: Manual, initialValue: false });
		this.ManualIndex = writable(0, this.Index.subscribe);
		this.Vertical = storable({ Store: Vertical, initialValue: false });
		this.Ordered = Ordered;
		this.TargetIndex = this.Index;

		this.Active = this.deriveMember('ManualIndex');
		this.Selected = this.deriveMember('Index');
	}

	get subscribe() {
		return this.Index.subscribe;
	}

	protected deriveMember(Index: 'Index' | 'ManualIndex') {
		return derived([this[Index], this.Ordered.Members], ([index, members]) => {
			const member = members.at(index);
			if (!member || member.isDisabled) return;
			return [member.element, member] as [HTMLElement, T & Navigable.Member];
		});
	}

	get index() {
		return this.primitive.index;
	}

	get manualIndex() {
		return this.primitive.manualIndex;
	}

	get isManual() {
		return this.primitive.isManual;
	}

	get isVertical() {
		return this.primitive.isVertical;
	}

	get length() {
		return this.Ordered.size;
	}
}
