<script>
	import { createEventDispatcher } from "svelte";
	import ImageGrid from "./ImageGrid.svelte";

	const dispatch = createEventDispatcher();

	export let startingDepth = 0;
	export let node;
	export let depth = 2;

	export let imageHeight = 50;
	export let imageWidth = 50;
	export let imagePadding;

	export const topAreaHeight = 15;
</script>

{#if node.children && node.depth - startingDepth < depth}
	<!-- NOT A LEAF -->
	{#each node.children as child}
		<!-- recurse each child -->
		<svelte:self
			node={child}
			{depth}
			{imageWidth}
			{imageHeight}
			{imagePadding}
			{startingDepth}
			on:click
		/>
	{/each}
{:else}
	<!-- LEAF -->
	<rect
		class="clickableArea"
		x={node.x}
		y={node.y}
		width={node.width}
		height={topAreaHeight + node.height}
		stroke="white"
		stroke-width={2}
		fill={node.children ? "black" : "saddlebrown"}
		on:click={() => {
			dispatch("click", node);
		}}
	/>
	<ImageGrid
		x={node.x}
		y={node.y + topAreaHeight}
		{imageHeight}
		{imageWidth}
		{imagePadding}
		width={node.width}
		height={node.height}
		cluster={node.cluster}
	/>
{/if}
