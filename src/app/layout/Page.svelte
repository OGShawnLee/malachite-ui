<script lang="ts">
	import { Options } from ".";

	export let title: string;
</script>

<svelte:head>
	<title>{title} - Malachite UI</title>
</svelte:head>

<main class="grid gap-12">
	<div class="grid gap-0.75">
		<h1 class="font-bold text-4xl text-white">{title}</h1>
		<Options>
			<slot name="options" />
		</Options>
	</div>
	<slot />
</main>
