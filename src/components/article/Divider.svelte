<script>
	export let style = "";
	export let vertical = false;
	export let thickness = 0.5;
	export let color = "#00000030";

	function addThickness(style, thickness) {
		style += vertical
			? `width: ${thickness}px; height: 100%;`
			: `width: 100%; height: ${thickness}px;`;
		return style;
	}
	function addColor(style, color) {
		style += `background-color: ${color};`;
		return style;
	}

	style = addThickness(style, thickness);
	style = addColor(style, color);
</script>

<div {style} />
