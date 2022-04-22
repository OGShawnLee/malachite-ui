<script>
	import { Switch, SwitchDescription, SwitchGroup, SwitchLabel } from '$lib/components';

	let checked = false;
	let passive = false;
</script>

<!-- Styling from Headless UI docs -->

<main class="container mx-auto my-8 | flex flex-col gap-12">
	<button on:click={() => (passive = !passive)}>
		Toggle Passive {passive}
	</button>
	<div class="grid grid-cols-4 gap-8">
		<Switch
			bind:checked
			class="{checked ? 'bg-cyan-900' : 'bg-cyan-700'}
		  relative inline-flex flex-shrink-0 h-[38px] w-[74px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 outline-none focus:(ring-1 ring-black)"
		>
			<span class="sr-only">Toggle Color Theme</span>
			<span
				aria-hidden="true"
				class="{checked
					? 'translate-x-9'
					: 'translate-x-0'} pointer-events-none inline-block h-[34px] w-[34px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200"
			/>
		</Switch>
		<!-- No need to use a Switch Group! -->
		<Switch as="slot" let:button let:description let:label let:isChecked>
			<div class="flex flex-col gap-3">
				<!-- Will reference all titles -->
				<span use:label={passive}> Toggle Color Theme </span>
				<span class="sr-only" for={null} use:label={passive}> This is a another label </span>
				<!-- Will reference all descriptions -->
				<p class="sr-only" use:description>Change Theme from Dark to Light and vice versa</p>
				<p class="sr-only" use:description>This is a another description</p>
				<button
					class="{isChecked
						? 'bg-red-900'
						: 'bg-red-700'} relative inline-flex flex-shrink-0 h-[38px] w-[74px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 outline-none focus:(ring-1 ring-black)"
					use:button
				>
					<span
						aria-hidden="true"
						class="{isChecked
							? 'translate-x-9'
							: 'translate-x-0'} pointer-events-none inline-block h-[34px] w-[34px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200"
					/>
				</button>
			</div>
		</Switch>
		<!-- With Components -->
		<Switch as="slot" let:button let:isChecked>
			<div class="flex flex-col gap-3">
				<!-- Will reference all titles -->
				<SwitchLabel class="sr-only">Toggle Color Theme</SwitchLabel>
				<SwitchLabel class="sr-only">This is another label</SwitchLabel>
				<!-- Will reference all descriptions -->
				<SwitchDescription class="sr-only">
					Change Theme from Dark to Light and vice versa
				</SwitchDescription>
				<SwitchDescription class="sr-only">This is a another description</SwitchDescription>
				<button
					class="{isChecked
						? 'bg-sky-900'
						: 'bg-sky-700'} relative inline-flex flex-shrink-0 h-[38px] w-[74px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 outline-none focus:(ring-1 ring-black)"
					use:button
				>
					<span
						aria-hidden="true"
						class="{isChecked
							? 'translate-x-9'
							: 'translate-x-0'} pointer-events-none inline-block h-[34px] w-[34px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200"
					/>
				</button>
			</div>
		</Switch>
		<!-- The Headless UI way -> Switch Group -->
		<SwitchGroup as="div" class="flex flex-col gap-3" let:isChecked>
			<SwitchLabel {passive}>Toggle Color Theme</SwitchLabel>
			<SwitchDescription class="sr-only">
				Change Theme from Dark to Light and vice versa
			</SwitchDescription>
			<Switch
				class="{isChecked
					? 'bg-rose-900'
					: 'bg-rose-700'} relative inline-flex flex-shrink-0 h-[38px] w-[74px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 outline-none focus:(ring-1 ring-black)"
			>
				<span
					aria-hidden="true"
					class="{isChecked
						? 'translate-x-9'
						: 'translate-x-0'} pointer-events-none inline-block h-[34px] w-[34px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200"
				/>
			</Switch>
		</SwitchGroup>
	</div>
</main>
