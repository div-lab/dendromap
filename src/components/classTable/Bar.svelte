<script>
	export let color;
	export let maxWidth;
	export let maxHeight;

	// create bar
	export let maxVal;
	export let val;
	export let textSpace = 10;
	export let middleSpace = 0;

	$: ratio = (val / maxVal) * (maxWidth - textSpace - middleSpace / 2);
</script>

<div
	class="bar-container"
	style={`height: ${maxHeight}px; width: ${maxWidth}px;`}
>
	<div
		class="bar-text"
		style={`height: ${maxHeight}px; width: ${
			textSpace - middleSpace / 2
		}px; margin-right:${middleSpace}px;`}
	>
		{val}
	</div>
	<div
		class="bar"
		style={`height: ${maxHeight}px; width: ${ratio}px; background-color: ${color};`}
	/>
</div>

<style>
	.bar-container {
		display: flex;
		justify-content: start;
	}
	.bar {
		transition: width 500ms ease-in-out;
	}
	.bar-text {
		text-align: end;
	}
</style>
