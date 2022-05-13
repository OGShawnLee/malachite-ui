<script lang="ts">
	import { Accordion, AccordionButton, AccordionHeader, AccordionItem, AccordionPanel } from '$lib';
	import { useClassNameResolver } from '$lib/hooks';
	import { useToggle } from '@test-utils';
	import { slide } from 'svelte/transition';

	const className = useClassNameResolver<'isOpen'>({
		base: 'px-6 py-2 font-medium outline-none',
		open: {
			on: 'bg-cyan-200 focus:(border-2 border-cyan-500)',
			off: 'focus:(border-2 border-rose-400)'
		}
	});

	let [finite, toggleFinite] = useToggle(false);
</script>

<main class="flex flex-col gap-12">
	<h1>Accordion</h1>
	<Accordion as="section" {finite}>
		<h2>The Accordion</h2>
		<button class="px-6 py-2 font-medium" class:bg-emerald-200={$finite} on:click={toggleFinite}>
			Toggle Finite
		</button>
		<AccordionItem>
			<AccordionHeader>
				<AccordionButton class={className}>First Item</AccordionButton>
			</AccordionHeader>
			<AccordionPanel let:close>
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod.</p>
				<button class="px-6 py-2 font-medium" on:click={close}>Close</button>
			</AccordionPanel>
		</AccordionItem>
		<AccordionItem open let:close>
			<AccordionHeader>
				<AccordionButton class={className}>Second Item</AccordionButton>
			</AccordionHeader>
			<AccordionPanel>
				<p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Architecto!</p>
				<button class="px-6 py-2 font-medium" on:click={close}>Close</button>
			</AccordionPanel>
		</AccordionItem>
		<AccordionItem open let:isOpen let:close let:button let:header>
			<h2 use:header>
				<button class={className({ isOpen })} use:button>Third Item</button>
			</h2>
			<AccordionPanel>
				<p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Architecto!</p>
				<button class="px-6 py-2 font-medium" on:click={close}>Close</button>
			</AccordionPanel>
		</AccordionItem>
		<AccordionItem open let:isOpen let:button let:header let:panel>
			<h2 use:header>
				<button class={className({ isOpen })} use:button>Fourth Item</button>
			</h2>
			<div slot="panel" use:panel let:close>
				<p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Architecto!</p>
				<button class="px-6 py-2 font-medium" on:click={close}>Close</button>
			</div>
		</AccordionItem>
	</Accordion>
	<Accordion as="section">
		<h2>The Cooler Accordion</h2>
		<AccordionItem let:panel let:close>
			<AccordionHeader>
				<AccordionButton class={className}>First Item</AccordionButton>
			</AccordionHeader>
			<div slot="panel" use:panel transition:slide>
				<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam, minima.</p>
				<button class="px-6 py-2 font-medium" on:click={close}>Close</button>
			</div>
		</AccordionItem>
		<AccordionItem let:panel let:close>
			<AccordionHeader>
				<AccordionButton class={className}>Second Item</AccordionButton>
			</AccordionHeader>
			<div slot="panel" use:panel transition:slide>
				<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam, minima.</p>
				<button class="px-6 py-2 font-medium" on:click={close}>Close</button>
			</div>
		</AccordionItem>
		<AccordionItem let:button let:header let:panel let:close let:isOpen>
			<h2 use:header>
				<button class={className({ isOpen })} use:button>Third Item</button>
			</h2>
			<div slot="panel" use:panel transition:slide>
				<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam, minima.</p>
				<button class="px-6 py-2 font-medium" on:click={close}>Close</button>
			</div>
		</AccordionItem>
	</Accordion>
</main>
