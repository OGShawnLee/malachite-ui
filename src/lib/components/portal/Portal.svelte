<script lang="ts" context="module">
	import { initIndexGenerator } from '$lib/core';
	import { isHTMLElement } from '$lib/predicate';
	import { tick } from 'svelte';

	const generateIndex = initIndexGenerator();

	function mountPortal(host: HTMLElement, child: HTMLElement) {
		host.appendChild(child);
	}

	function portal(node: HTMLElement, target: HTMLElement | string = 'body') {
		let host = isHTMLElement(target) ? target : document.querySelector(`${target}`);
		if (isHTMLElement(host)) mountPortal(host, node);
		else {
			tick().then(() => {
				host = document.querySelector(`${target}`);
				if (isHTMLElement(host)) mountPortal(host, node);
				else throw Error('Unable to find Portal Host');
			});
		}
		if (isHTMLElement(target)) mountPortal(target, node);
		return {
			destroy() {
				const hostExists = document.contains(host);
				const portalExists = document.contains(node);
				if (host && hostExists && portalExists) host.removeChild(node);
			}
		};
	}
</script>

<script lang="ts">
	export let id: Nullable<string> = undefined;
	export let target: HTMLElement | string = 'body';

	const index = generateIndex();
	$: finalName = id ? `${id}-${index}` : id;
</script>

<div id={finalName} use:portal={target} {...$$restProps}>
	<slot />
</div>
