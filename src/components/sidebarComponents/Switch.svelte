<script>
	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();

	export let switchSize = 40;
	export let initOn = false;
	export let onColor = "black";
	export let offColor = "lightgrey";
	export let onCircleColor = "white";
	export let offCircleColor = "white";
	export let disabled = false;
	export let style = "";

	export let on = initOn;
	const _switch = () => {
		on = !on;
		dispatch("switch", on);
	};

	const width = 40;
	const height = 20;
	const circleSize = height / 2 - 3;
	const curveOnRect = 10;
	const circleSpaceToEnd = curveOnRect;
	const onCirclePosition = width - circleSpaceToEnd;
	const offCirclePosition = circleSpaceToEnd;

	$: currColor = on ? onColor : offColor;
	$: currCircleColor = on ? onCircleColor : offCircleColor;
	$: currCirclePosition = on ? onCirclePosition : offCirclePosition;
</script>

<div style="width: {switchSize}px;cursor: pointer;{style}">
	<svg
		viewbox="0 0 {width} {height}"
		on:click={() => {
			if (!disabled) {
				_switch();
			}
		}}
	>
		<rect
			rx={curveOnRect}
			ry={curveOnRect}
			{width}
			{height}
			fill={currColor}
		/>
		<circle
			r={circleSize}
			cx={currCirclePosition}
			cy={height / 2}
			fill={currCircleColor}
		/>
	</svg>
</div>

<style>
	rect,
	circle {
		transition: all ease-in-out 300ms;
	}
</style>
