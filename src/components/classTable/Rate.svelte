<script>
	import Dot from "./Dot.svelte";

	export let normalizedValue = 0.9852;
	export let dotSize = 15;
	export let maxColor = "#006164";
	export let height = 15;
	export let width = 50;
	$: text = `${(normalizedValue * 100).toFixed(0)}%`;
</script>

<div class="rate-container" style="height: {height}px; width: {width}px;">
	<div class="rate-text">
		{text}
	</div>
	<div class="rate-dot">
		<Dot diameter={dotSize} {maxColor} {normalizedValue} />
	</div>
</div>

<style>
	.rate-container {
		display: flex;
		align-items: center;
		justify-content: end;
	}
	.rate-text {
		font-size: 10px;
		text-align: end;
		margin-right: 0.5em;
	}
	.rate-dot {
	}
</style>
