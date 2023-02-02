import type { Switch } from '$lib/types';
import { ref } from '$lib/utils';

export default function useSwitch(initialValue: boolean): Switch {
	const isChecked = ref(initialValue);

	function toggle() {
		isChecked.update((isChecked) => !isChecked);
	}

	return {
		...isChecked,
		toggle,
		get value() {
			return isChecked.value;
		},
		set value(value: boolean) {
			isChecked.value = value;
		}
	};
}