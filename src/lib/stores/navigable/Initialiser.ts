import type { Expand, Navigable, Store } from '$lib/types';
import type { Readable, Writable } from 'svelte/store';
import { type Ordered, storable } from '$lib/stores';
import { derived, writable } from 'svelte/store';

type Member = Expand<Navigable.Member>;
type Options<T> = Expand<Navigable.Options<T>>;

export default class Initialiser<T> {
	readonly Finite: Readable<boolean>;
	protected readonly Index: Store<number>;
	readonly Manual: Readable<boolean>;
	protected readonly ManualIndex: Writable<number>;
	protected readonly Ordered: Ordered<T & Member>;
	readonly Vertical: Readable<boolean>;
	protected readonly ShouldWait: Readable<boolean>;
	protected TargetIndex: Writable<number>;
	readonly Waiting: Writable<boolean>;

	readonly Active: Readable<undefined | [HTMLElement, T & Member]>;
	readonly Selected: Readable<undefined | [HTMLElement, T & Member]>;

	protected readonly primitive: Expand<Navigable.Primitive<T>> = {
		active: undefined,
		elements: [],
		index: 0,
		isFinite: false,
		isManual: false,
		isVertical: false,
		isWaiting: false,
		manualIndex: 0,
		selected: undefined,
		shouldWait: false
	};

	shouldFocus = true;
	startAt: Navigable.StartAt;

	constructor({ Index, Manual, Vertical, Ordered, ShouldWait, ...rest }: Options<T>) {
		this.Finite = storable({ Store: rest.Finite, initialValue: false });
		this.Index = storable({ Store: Index, initialValue: 0 });
		this.Manual = storable({ Store: Manual, initialValue: false });
		this.ManualIndex = writable(0, this.Index.subscribe);
		this.Vertical = storable({ Store: Vertical, initialValue: false });
		this.Ordered = Ordered;
		this.ShouldWait = storable({ Store: ShouldWait, initialValue: false });
		this.TargetIndex = this.Index;
		this.Waiting = writable(false, this.ShouldWait.subscribe);

		this.Active = this.deriveMember('ManualIndex');
		this.Selected = this.deriveMember('Index');

		this.shouldFocus = rest.shouldFocus ?? true;
		this.startAt = rest.startAt ?? 'AUTO';
	}

	get subscribe() {
		return this.Index.subscribe;
	}

	protected deriveMember(Index: 'Index' | 'ManualIndex') {
		return derived(
			[this[Index], this.Ordered.Members, this.Waiting],
			([index, members, isWaiting]) => {
				if (isWaiting) return;
				const member = members.at(index);
				if (!member || member.isDisabled) return;
				return [member.element, member] as [HTMLElement, T & Navigable.Member];
			}
		);
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

	get isWaiting() {
		return this.primitive.isWaiting;
	}

	get isFinite() {
		return this.primitive.isFinite;
	}

	get activeElement() {
		return this.primitive.active?.[0];
	}

	get selectedElement() {
		return this.primitive.selected?.[0];
	}

	get shouldWait() {
		return this.primitive.shouldWait;
	}

	get length() {
		return this.Ordered.size;
	}
}
