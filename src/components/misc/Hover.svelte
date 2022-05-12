<script>
	import { createEventDispatcher } from "svelte";

	export let style = "";
	const dispatch = createEventDispatcher();
	export let hovering = false;
	$: dispatch("hover", hovering);
</script>

<div
	{style}
	class="invisible-container"
	on:mouseenter={() => {
		hovering = true;
	}}
	on:mouseleave={() => {
		hovering = false;
	}}
>
	<slot />
</div>

<style>
	.invisible-container {
		display: inline;
	}
</style>
