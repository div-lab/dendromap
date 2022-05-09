<script>
	import { scaleLinear } from "d3";

	export let min = 1;
	export let max = 100;
	export let step = 1;
	export let textShift = 0;
	export let sliderOffset = 15;
	export let defaultTextColor = "";
	export let inputTextColor = "";

	export let width = 150;
	export let height = 20;
	export let value;
	export let valueFormatCallback = (value) => value;

	let currentTextColor = defaultTextColor;
	let holdingDown = false;
	let hovering = false;
	$: interaction = holdingDown
		? `cursor: grabbing`
		: hovering
		? `cursor: grab;`
		: "";
	$: xScale = scaleLinear()
		.domain([min, max])
		.range([0 + sliderOffset, width - sliderOffset]);
</script>

<div style="width: {width}px; height: {height}px;">
	<svg {width} {height}>
		<text
			fill={currentTextColor}
			x={xScale(value) + textShift}
			y={height}
			style="font-size: 12px;"
			text-anchor="middle">{valueFormatCallback(value)}</text
		>
	</svg>
	<input
		bind:value
		on:mouseenter={() => {
			currentTextColor = inputTextColor;
			hovering = true;
		}}
		on:mouseleave={() => {
			currentTextColor = defaultTextColor;
			hovering = false;
		}}
		on:mousedown={() => {
			holdingDown = true;
		}}
		on:mouseup={() => {
			holdingDown = false;
		}}
		type="range"
		{min}
		{max}
		{step}
		style="accent-color: var(--dark-grey); background-color: lightgrey; width:{width}px;{interaction}"
	/>
</div>

<style>
	div {
		position: relative;
	}
	svg {
		position: absolute;
		left: 0;
		top: 0;
		overflow: visible;
	}
	input {
		position: absolute;
		left: 0;
		top: 0;
	}
</style>
