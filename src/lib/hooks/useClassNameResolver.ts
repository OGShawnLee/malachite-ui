import type {
	ClassName,
	ComponentState,
	ComponentStates,
	Nullable,
	Optional,
	SwitchClassName
} from '$lib/types';
import { isEmpty, isFunction, isNullish, isObject, isString } from '$lib/predicate';
import { makeUnique } from '$lib/utils';

export function useClassNameResolver<S extends ComponentStates>(
	className?: Nullable<ClassName<S>>
) {
	return function (
		state: ComponentState<S>,
		dualCombination: 'ACTIVE-SELECTED' | 'ACTIVE-CHECKED' | 'CHECKED-SELECTED' = 'ACTIVE-SELECTED'
	): Nullable<string> {
		if (isString(className)) return clearClassName(className);
		if (isFunction(className)) return clearClassName(className(state));

		if (isObject(className)) {
			let { active, base, checked, disabled, dual, open, triple, selected } = className;

			if (isFunction(base)) return clearClassName(base(state));
			if (isObject(base)) base = useClassNameResolver(base)(state);

			const { isActive, isChecked, isDisabled, isOpen, isSelected } = state as Optional<
				ComponentState<ComponentStates>
			>;
			const classList = [base];

			if (isDisabled) {
				classList.push(clearClassName(disabled));
				return processClassList(classList);
			}

			classList.push(handleSwitchClassName(open, isOpen));

			if (isActive && isChecked && isSelected) {
				return classList.push(triple), processClassList(classList);
			}

			switch (dualCombination) {
				case 'ACTIVE-CHECKED':
					if (isActive && isChecked) {
						classList.push(dual, handleSwitchClassName(selected, isSelected));
						return processClassList(classList);
					}
					break;
				case 'ACTIVE-SELECTED':
					if (isActive && isSelected) {
						classList.push(dual, handleSwitchClassName(checked, isChecked));
						return processClassList(classList);
					}
					break;
				case 'CHECKED-SELECTED':
					if (isChecked && isSelected) {
						classList.push(dual, handleSwitchClassName(active, isActive));
						return processClassList(classList);
					}
			}

			classList.push(
				handleSwitchClassName(active, isActive),
				handleSwitchClassName(checked, isChecked),
				handleSwitchClassName(selected, isSelected)
			);

			return processClassList(classList);
		}

		return className;
	};
}

function clearClassName(className: Nullable<string>) {
	if (isNullish(className)) return;

	className = className.trim().replace(/\s\s+/g, ' ');
	return isEmpty(className) ? null : makeUnique(className.split(' ')).join(' ');
}

function handleSwitchClassName(
	className: Nullable<string | SwitchClassName>,
	condition: boolean | undefined
) {
	if (isObject(className)) {
		const { on, off } = className;
		return condition ? on : off;
	} else if (condition) return className;
}

function processClassList(classList: Nullable<string>[]) {
	let className = '';

	for (let str of classList) {
		if (isString(str) && !isEmpty(str)) {
			str = str.trim().replace(/\s\s+/g, ' ');
			className += ` ${str}`;
		}
	}

	className = className.trim();
	return isEmpty(className) ? null : makeUnique(className.split(' ')).join(' ');
}
