<script>
	import Render from '@components/render';

	let value = 'tamales';
</script>

<h1>Welcome to Svelte Malachite-UI</h1>
<p>A component library inspired by Tailwind Headless UI</p>

<span>{value}</span>
<Render as="input" bind:value />
