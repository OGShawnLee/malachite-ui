<script lang="ts">
	import { Menu, MenuButton, MenuItems, MenuItem } from '$lib';
</script>

<button>External</button>

<Menu>
	<MenuButton>Toggle</MenuButton>
	<MenuItems data-testid="menu-panel">
		<MenuItem disabled>A Item</MenuItem>
		<MenuItem>B Item</MenuItem>
		<MenuItem disabled>C Item</MenuItem>
		<MenuItem disabled>D Item</MenuItem>
		<MenuItem>E Item</MenuItem>
		<MenuItem>F Item</MenuItem>
		<MenuItem disabled>G Item</MenuItem>
	</MenuItems>
</Menu>
