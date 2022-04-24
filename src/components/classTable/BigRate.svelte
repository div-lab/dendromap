<script>
	import Dot from "./Dot.svelte";

	export let normalizedValue = 0.9852;
	export let dotSize = 15 * 1.9;
	export let maxColor = "#006164";
	export let height = 15 * 2;
	export let width = 80;
	export let fixed = 2;
	export let textStyle = "";
	$: text = `${(normalizedValue * 100).toFixed(fixed)}%`;
</script>

<div class="rate-container" style="height: {height}px; width: {width}px;">
	<div class="rate-text" style={textStyle}>
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
		font-size: 16px;
		text-align: middle;
		margin-right: 0.2rem;
		margin-top: -6px;
	}
	.rate-dot {
	}
</style>
