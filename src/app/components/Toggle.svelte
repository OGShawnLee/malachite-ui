<script lang="ts">
	import { Switch } from "$lib";
	import { useClassNameResolver } from "$lib/hooks";

	export let checked = false;
	export let text = "Toggle";

	$: finalClassName = useClassNameResolver<"CHECKED">({
		base: "px-8 py-2 | bg-neutral-800 border-2 border-transparent outline-none font-medium hover:bg-neutral-700 focus:border-white",
		checked: { on: "bg-neutral-700 text-white", off: "" }
	})({ isChecked: checked });
</script>

<Switch class={finalClassName} bind:checked>
	<slot>{text}</slot>
</Switch>
