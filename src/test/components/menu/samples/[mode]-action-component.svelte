<script lang="ts">
	import { Menu, MenuButton, MenuItems, MenuItem } from '$lib';

	export let horizontal: boolean | undefined = undefined;
	export let finite: boolean | undefined = undefined;
</script>

<button> External </button>

<Menu {finite} {horizontal}>
	<MenuButton as="slot" let:button>
		<button use:button> Toggle </button>
	</MenuButton>

	<MenuItems as="slot" let:items>
		<div use:items data-testid="menu-panel">
			<MenuItem as="slot" let:item>
				<button use:item> Item 1 </button>
			</MenuItem>
			<MenuItem as="slot" let:item>
				<button use:item> Item 2 </button>
			</MenuItem>
			<MenuItem as="slot" let:item>
				<button use:item> Item 3 </button>
			</MenuItem>
			<MenuItem as="slot" let:item>
				<button use:item> Item 3 </button>
			</MenuItem>
		</div>
	</MenuItems>
</Menu>
