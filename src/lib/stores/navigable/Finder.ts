import Core from './Core';
import type { Navigable } from '$lib/types';
import { findIndex, findLastIndex } from '$lib/utils';
import { isNotDisabled } from '$lib/predicate';

export default class Finder<T> extends Core<T> {
	constructor(Options: Navigable.Options<T>) {
		super(Options);
	}

	findIndexFromEnd(index = this.length - 1) {
		return findLastIndex(this.primitive.elements, isNotDisabled, index);
	}

	findIndexFromStart(index = 0) {
		return findIndex(this.primitive.elements, isNotDisabled, index);
	}

	findValidIndex(options: {
		direction: 'BACK' | 'NEXT' | 'BOUNCE';
		furthest?: boolean;
		startAt?: number;
	}) {
		const { direction, furthest, startAt = this.manualIndex } = options;
		return this.useValidIndex(() => {
			switch (direction) {
				case 'BACK':
					if (furthest) return this.findIndexFromStart();
					const previous = this.findIndexFromEnd(startAt - 1);
					if (previous > -1) return previous;
					return this.findIndexFromEnd();
				case 'NEXT':
					if (furthest) return this.findIndexFromEnd();
					const next = this.findIndexFromStart(startAt + 1);
					if (next > -1) return next;
					return this.findIndexFromStart();
				default:
					const validIndex = this.findIndexFromStart(startAt + 1);
					return validIndex >= 0 ? validIndex : this.findIndexFromEnd(startAt - 1);
			}
		});
	}
}
