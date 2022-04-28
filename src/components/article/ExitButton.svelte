<script>
	import CrossIcon from "../misc/CrossIcon.svelte";
	import Hover from "../misc/Hover.svelte";
	let hovering = false;
</script>

<Hover bind:hovering>
	<div on:click id="exit" title="Exit Sidebar.">
		<CrossIcon height={20} fill={hovering ? "grey" : "lightgrey"} />
	</div>
</Hover>

<style>
	#exit {
		--space: 20px;
		position: absolute;
		right: var(--space);
		top: var(--space);
		cursor: pointer;
	}
</style>
