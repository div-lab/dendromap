import * as d3 from "d3";

let currentGroup; // save some computation for the reset
export function highlightImages({
	imageGroup = d3.selectAll("image"),
	instancesToHighlight = [],
	hiddenOpacity = 0.25,
	highlightedOpacity = 1.0,
} = {}) {
	currentGroup = imageGroup;
	imageGroup.attr("opacity", hiddenOpacity);
	instancesToHighlight.forEach((similarInstanceIndex) => {
		d3.select(`image#image-${similarInstanceIndex}`).attr(
			"opacity",
			highlightedOpacity
		);
	});
}

export function resetOpacity({
	group = currentGroup,
	highlightedOpacity = 1.0,
} = {}) {
	d3.selectAll("image")
		.attr("opacity", (d) => d.opacity)
		.style("outline", (d) => d.style);
}
