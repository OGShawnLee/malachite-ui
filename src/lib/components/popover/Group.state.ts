import { ToggleableGroup } from '$lib/stores';
import { useContext } from '$lib/hooks';

export function createPopoverGroupState() {
	const group = new ToggleableGroup();
	setContext(group);
	return group.isOpen;
}

const { getContext, setContext } = useContext({
	component: 'popover-group',
	predicate: (context): context is ToggleableGroup => {
		return context instanceof ToggleableGroup;
	}
});

export { getContext };
