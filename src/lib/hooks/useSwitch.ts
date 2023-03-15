import type { Switch } from '$lib/types';
import { ref } from '$lib/utils';

export default function useSwitch(initialValue: boolean): Switch {
	const isChecked = ref(initialValue) as Switch;
	isChecked.toggle = () => {
		isChecked.update((isChecked) => !isChecked);
	};
	return isChecked;
}
