<script lang="ts">
	import { Menu, MenuButton, MenuItem, MenuItems } from '$lib';
	import { useToggle } from '@test-utils';
	import { fade } from 'svelte/transition';

	const [horizontal, toggleHorizontal] = useToggle(false);
	const [finite, toggleFinite] = useToggle(true);

	let primitiveHorizontal = false;
	function togglePrimitiveHorizontal() {
		primitiveHorizontal = !primitiveHorizontal;
	}

	function doSuff(this: HTMLElement) {
		console.log(this.textContent);
	}
</script>

<button on:click={toggleHorizontal}>
	Toggle Horizontal {$horizontal}
</button>
<button on:click={toggleFinite}>
	Toggle Finite {$finite}
</button>

<Menu as="div" class="flex flex-col gap-6" {horizontal} {finite}>
	<MenuButton class="px-6 py-2 font-medium">Toggle</MenuButton>
	<MenuItems class="flex flex-col gap-3">
		<MenuItem class="px-6 py-2 font-medium" on:click={doSuff}>Activate</MenuItem>
		<MenuItem class="px-6 py-2 font-medium opacity-40" disabled on:click={doSuff}>Delete</MenuItem>
		<MenuItem class="px-6 py-2 font-medium" on:click={doSuff}>Edit</MenuItem>
		<MenuItem class="px-6 py-2 font-medium opacity-40" disabled on:click={doSuff}>Nuke</MenuItem>
	</MenuItems>
</Menu>

<button on:click={togglePrimitiveHorizontal}>
	Toggle Horizontal {primitiveHorizontal}
</button>
<Menu as="div" class="flex flex-col gap-6" horizontal={primitiveHorizontal} let:items>
	<MenuButton class="px-6 py-2 font-medium">Toggle</MenuButton>
	<div slot="items" class="flex flex-col gap-3" use:items transition:fade>
		<MenuItem class="px-6 py-2 font-medium opacity-40" disabled let:isSelected>
			Activate {isSelected}
		</MenuItem>
		<MenuItem class="px-6 py-2 font-medium" let:isSelected>
			Delete {isSelected}
		</MenuItem>
		<MenuItem class="px-6 py-2 font-medium" let:isSelected>
			Edit {isSelected}
		</MenuItem>
		<MenuItem class="px-6 py-2 font-medium opacity-40" disabled let:isSelected>
			Nuke {isSelected}
		</MenuItem>
	</div>
</Menu>

<Menu as="div" class="flex gap-6" horizontal let:button>
	<button class="px-6 py-2 font-medium" use:button>Toggle</button>
	<MenuItems class="flex gap-3">
		<MenuItem class="px-6 py-2 font-medium opacity-40" disabled let:isSelected>
			Activate {isSelected}
		</MenuItem>
		<MenuItem class="px-6 py-2 font-medium" let:isSelected>
			Delete {isSelected}
		</MenuItem>
		<MenuItem class="px-6 py-2 font-medium" let:isSelected>
			Edit {isSelected}
		</MenuItem>
		<MenuItem class="px-6 py-2 font-medium opacity-40" disabled let:isSelected>
			Nuke {isSelected}
		</MenuItem>
	</MenuItems>
</Menu>

<Menu as="div" class="flex flex-col gap-6">
	<MenuButton class="px-6 py-2 font-medium">Toggle</MenuButton>
	<MenuItems class="flex flex-col gap-3">
		<MenuItem as="button" class="px-6 py-2 font-medium">Activate</MenuItem>
		<MenuItem as="button" class="px-6 py-2 font-medium">Delete</MenuItem>
		<MenuItem as="button" class="px-6 py-2 font-medium">Update</MenuItem>
	</MenuItems>
</Menu>

<Menu as="div" class="flex flex-col gap-6" finite>
	<MenuButton class="px-6 py-2 font-medium">Toggle</MenuButton>
	<MenuItems class="flex flex-col gap-3">
		<MenuItem as="button" class="px-6 py-2 font-medium" disabled>Activate</MenuItem>
		<MenuItem as="button" class="px-6 py-2 font-medium" let:isSelected>
			Edit {isSelected}
		</MenuItem>
		<MenuItem as="button" class="px-6 py-2 font-medium" let:isSelected>
			Delete {isSelected}
		</MenuItem>
		<MenuItem as="button" class="px-6 py-2 font-medium" disabled>Update</MenuItem>
	</MenuItems>
</Menu>

<Menu>
	<MenuButton>Toggle</MenuButton>
	<MenuItems data-testid="menu-panel">
		<MenuItem disabled let:isSelected>
			A Item <span> {isSelected} </span>
		</MenuItem>
		<MenuItem let:isSelected>
			B Item <span> {isSelected} </span>
		</MenuItem>
		<MenuItem disabled let:isSelected>
			C Item <span> {isSelected} </span>
		</MenuItem>
		<MenuItem disabled let:isSelected>
			D Item <span> {isSelected} </span>
		</MenuItem>
		<MenuItem let:isSelected>
			E Item <span> {isSelected} </span>
		</MenuItem>
		<MenuItem let:isSelected>
			F Item <span> {isSelected} </span>
		</MenuItem>
		<MenuItem disabled let:isSelected>
			G Item <span> {isSelected} </span>
		</MenuItem>
	</MenuItems>
</Menu>

<style>
	:global(button:focus) {
		background-color: hsl(0, 0%, 40%);
	}
</style>
