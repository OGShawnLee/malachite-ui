<script lang="ts">
	import type { Readable } from 'svelte/store';
	import {
		Accordion,
		AccordionButton,
		AccordionHeader,
		AccordionItem,
		AccordionPanel
	} from '$lib/components';

	export let finite: Readable<boolean> | boolean | undefined = undefined;
</script>

<Accordion data-testid="accordion" {finite}>
	<AccordionItem data-testid="item" let:close>
		<AccordionHeader as="slot" let:header>
			<h2 use:header data-testid="header">
				<AccordionButton as="slot" let:button>
					<button use:button data-testid="button"> Button 1 </button>
				</AccordionButton>
			</h2>
		</AccordionHeader>
		<AccordionPanel as="slot" let:panel>
			<div data-testid="panel" use:panel>
				Panel 1
				<button on:click={close}>Close Item</button>
			</div>
		</AccordionPanel>
	</AccordionItem>
	<AccordionItem data-testid="item" let:close>
		<AccordionHeader as="slot" let:header>
			<h2 use:header data-testid="header">
				<AccordionButton as="slot" let:button>
					<button use:button data-testid="button"> Button 2 </button>
				</AccordionButton>
			</h2>
		</AccordionHeader>
		<AccordionPanel as="slot" let:panel>
			<div data-testid="panel" use:panel>
				Panel 2
				<button on:click={close}>Close Item</button>
			</div>
		</AccordionPanel>
	</AccordionItem>
	<AccordionItem data-testid="item" let:close>
		<AccordionHeader as="slot" let:header>
			<h2 use:header data-testid="header">
				<AccordionButton as="slot" let:button>
					<button use:button data-testid="button"> Button 3 </button>
				</AccordionButton>
			</h2>
		</AccordionHeader>
		<AccordionPanel as="slot" let:panel>
			<div data-testid="panel" use:panel>
				Panel 3
				<button on:click={close}>Close Item</button>
			</div>
		</AccordionPanel>
	</AccordionItem>
</Accordion>
