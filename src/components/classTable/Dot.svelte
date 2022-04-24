<script>
	export let maxColor;
	export let normalizedValue;
	export let diameter;
	const radius = diameter / 2;
</script>

<div>
	<svg width={diameter} height={diameter}>
		<circle
			cx={radius}
			cy={radius}
			r={radius}
			opacity={normalizedValue}
			fill={maxColor}
			stroke="none"
		/>
	</svg>
</div>

<style>
	circle {
		transition: opacity ease-in-out 400ms;
	}
</style>
