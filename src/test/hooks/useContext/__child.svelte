<script lang="ts">
	export let getContext: () => unknown;
	export let receiveContext: (value: unknown) => void;

	receiveContext(getContext());
</script>

<slot />
