<script>
	import * as d3 from "d3";
	import { onMount, createEventDispatcher } from "svelte";
	import {
		treemapColorGenerator,
		ID,
		forEachSelection,
		formatDendrogram,
	} from "./util";
	import { highlightImages, resetOpacity } from "./highlightImages";
	import { kClustersTreeMap, sortingKClustersTreeMap } from "./treemapper";

	const dispatch = createEventDispatcher();
	const dispatchNames = {
		image: {
			click: "imageClick",
			mouseEnter: "imageMouseEnter",
			mouseLeave: "imageMouseLeave",
		},
		cluster: {
			click: "clusterClick",
			mouseEnter: "clusterMouseEnter",
			mouseLeave: "clusterMouseLeave",
		},
		parent: {
			click: "parentClick",
			mouseEnter: "parentMouseEnter",
			mouseLeave: "parentMouseLeave",
		},
	};

	function exportDataUp(name, payload, element, event) {
		const formatted = {
			data: payload,
			element,
			event,
		};
		dispatch(name, formatted);
	}

	/**
	 *  These are for the jsdoc for better autocomplete for when doing type comments
	 * @typedef {{localLeaf: boolean, x0: number, y0: number, x1: number, y1: number}} AdditionalProperties
	 * @typedef {(d3.HierarchyNode | AdditionalProperties} HierarchyNode
	 */

	/** @type {HierarchyNode} */
	export let dendrogramData = {};

	export let imageHeight;
	export let imageWidth;
	export let numClustersShowing = 8;
	export let clusterLabelCallback = (d) => {
		const totalLabel = `${d.data.node_count} image${
			d.data.node_count > 1 ? "s" : ""
		}`;
		return totalLabel;
	};
	export let imageTitleCallback = (d) =>
		`Click to select image ${d.instance_index}`;
	export let clusterColorInterpolateCallback = d3.interpolateGreys;
	export let currentParentCluster = null; // bind

	// style and dimensions
	export let width = 1600;
	export let height = 1000;
	export let svgStyle = "";
	export let transitionSpeed = 750;
	export let outerPadding = 10;
	export let innerPadding = 10;
	export let topPadding = 10;
	export let labelYSpace = 20;
	export let highlightedOpacity = 1.0;
	export let hiddenOpacity = 0.25;
	export let imageFilepath;
	export let imagesToFocus = [];
	export let labelColorCallback = (d) => (d.height < 5 ? "white" : "black");
	export let labelSizeCallback = (d) => "10px";
	export let outlineMisclassified = undefined;
	export let focusMisclassified = undefined;
	export let misclassificationColor = "red";
	export let outlineStrokeWidth = "2px";

	// format the data correctly
	$: formattedDendrogramData = formatDendrogram(dendrogramData, true);

	/** @type {"breadth" | "min_merging_distance" | "max_node_count" | "custom_sort"} */
	export let renderingMethod = "breadth";
	export let customSort = () => {
		throw new Error(
			"specify your own sorting function here if you picked random for renderingMethod"
		);
	};

	const kClustersTreemapCustomSort = (obj, sort) => {
		obj.sortOrder = sort;
		return sortingKClustersTreeMap(obj);
	};
	const kClustersMaxCount = (obj) =>
		kClustersTreemapCustomSort(obj, (a, b) => a.node_count - b.node_count);
	const kClustersMinMerging = (obj) =>
		kClustersTreemapCustomSort(
			obj,
			(a, b) => b.merging_distance - a.merging_distance
		);
	const kClustersUserSpecified = (obj) =>
		kClustersTreemapCustomSort(obj, customSort);

	$: renderingOptions = {
		breadth: kClustersTreeMap,
		min_merging_distance: kClustersMinMerging,
		max_node_count: kClustersMaxCount,
		custom_sort: kClustersUserSpecified,
	};
	$: currentRenderingMethod = renderingOptions[renderingMethod];

	/**@type {d3.Selection}*/
	let group;
	/**@type {d3.Selection}*/
	let svg;
	/**@type {(t: number) => string}*/
	let color;
	/** @type {HierarchyNode[]} */
	let prevRoots = []; // stack used for keep track of last root came from
	let svelteSvg;
	let x = d3.scaleLinear().rangeRound([0, width]);
	let y = d3.scaleLinear().rangeRound([0, height]);
	let ogRootCount = 0;
	function init() {
		ogRootCount = formattedDendrogramData.data.node_count;
		// create the svg that we will work with
		svg = d3.select(svelteSvg);
		svg.attr("style", svgStyle).attr("width", width).attr("height", height);
		x.domain([0, width]);
		y.domain([0, height]);

		// pick a color for the rectangles as they descend deeper
		color = treemapColorGenerator(
			clusterColorInterpolateCallback,
			formattedDendrogramData.height,
			{
				offset: 1,
				reverseColorDirection: false,
			}
		);

		// render the treemap
		group = svg.append("g").call(render, formattedDendrogramData);
		currentParentCluster = formattedDendrogramData;
	}

	onMount(() => {
		init();
	});

	// used in both zoomin and zoomout
	function copyDims(treemappedNode) {
		return {
			x0: treemappedNode.x0,
			x1: treemappedNode.x1,
			y0: treemappedNode.y0,
			y1: treemappedNode.y1,
		};
	}
	/**
	 * Zooms out `from` a child `to` a parent
	 * @param {{from: HierarchyNode, to: HierarchyNode, fadeDuration?: number, positionDuration?: number}} zoomConfig
	 */
	function zoomout({ from, to } = {}) {
		// select the already rendered group as group0
		const group0 = group.attr("pointer-events", "none");
		// render the new group
		const group1 = (group = svg.insert("g", "*").call(render, to));

		// this is the changes from the render and is now the smaller rectangle inside of the larger
		let fromCopyDims = copyDims(from);

		// rescale to make the outer one much larger to start
		let newX = d3
			.scaleLinear()
			.domain([fromCopyDims.x0, fromCopyDims.x1])
			.rangeRound([0, width]);
		let newY = d3
			.scaleLinear()
			.domain([fromCopyDims.y0, fromCopyDims.y1])
			.rangeRound([0, height]);
		// keep the copy so we can go back
		let prevX = x.copy();
		let prevY = y.copy();

		// this is very reminiscent of change of basis in linear algebra
		// here I update the scaling for positioning
		x = newX;
		y = newY;
		// position the new outer group much larger (what we zoom out to)
		group1.call(position);
		// want to make the larger go smaller, so invert back
		x = x.invert;
		y = y.invert;

		svg.transition()
			.duration(transitionSpeed)
			.call((t) =>
				group0
					.transition(t)
					.remove()
					.attrTween("opacity", () => d3.interpolate(1, 0))
					.call(position, from)
			);
		// revert back to original scaling
		x = prevX;
		y = prevY;
		svg.transition()
			.duration(transitionSpeed)
			.call((t) => group1.transition(t).call(position, to));

		currentParentCluster = to;
	}

	/**
	 * Zooms in `to` a child `from` a parent
	 * @param {{from: HierarchyNode, to: HierarchyNode}} zoomConfig
	 */
	function zoomin({ from, to } = {}) {
		let toCopyOfDims = copyDims(to);
		console.log(toCopyOfDims);

		// create the two groups we will transition from
		const group0 = group.attr("pointer-events", "none"); // previous group
		// given the treemap renders in the whole screen, fit in the previous square
		const group1 = (group = svg.append("g").call(render, to)); // new group to zoom into

		// create new scale to size the rectangle smaller inside where it starts
		let newX = d3
			.scaleLinear()
			.domain([0, width])
			.rangeRound([toCopyOfDims.x0, toCopyOfDims.x1]);
		let newY = d3
			.scaleLinear()
			.domain([0, height])
			.rangeRound([toCopyOfDims.y0, toCopyOfDims.y1]);
		let prevX = x.copy();
		let prevY = y.copy();

		x = newX;
		y = newY;
		// group0.selectAll(".leaf").selectAll("image").remove();
		group1.call(position, to);
		x = x.invert;
		y = y.invert;

		svg.transition()
			.duration(transitionSpeed)
			.call((t) => group0.transition(t).remove().call(position, from)); // transition out the old group
		x = prevX;
		y = prevY;
		svg.transition()
			.duration(transitionSpeed)
			.call((t) =>
				group1
					.transition(t)
					.attrTween("opacity", () => d3.interpolate(1, 1))
					.call(position, to)
			); // transition in the new group

		currentParentCluster = to;
	}

	/**
	 * this gridifies images within the provided square
	 * @param {number} x0
	 * @param {number} y0
	 * @param {number} x1
	 * @param {number} y1
	 * @param {number} imageWidth
	 * @param {number} imageHeight
	 * @param {any[]} cluster
	 */
	function gridifyImageArray(
		x0,
		y0,
		x1,
		y1,
		imageWidth,
		imageHeight,
		cluster
	) {
		const width = x1 - x0;
		const height = y1 - y0;
		const totalArea = width * height;
		const imageArea = imageWidth * imageHeight;
		const maxNumImages = totalArea / imageArea;

		if (imageArea < 0 || maxNumImages < 0) {
			console.log("negative area");
			return [];
		}

		// next render in a grid
		let flattenedGrid = [];
		const maxNumRows = Math.floor(height / imageHeight);
		const maxNumCols = Math.floor(width / imageWidth);

		// place the images in grid by iterating 2D like over the 1D array
		let currRow = 0;
		let currCol = 0;
		let imagePlaced = 0;
		let currArrayIndex = 0;
		const allImagesFitInGrid = cluster.length <= maxNumImages;

		let currArrayIndexIncrementSize = 1;
		if (!allImagesFitInGrid) {
			const sampleIncrement = Math.floor(cluster.length / maxNumImages);
			currArrayIndexIncrementSize = sampleIncrement;
			if (currArrayIndexIncrementSize === 0)
				currArrayIndexIncrementSize = 1;
		}

		// compare the number of images placed under this method compared to actual
		while (
			currRow < maxNumRows &&
			currArrayIndex < cluster.length &&
			imagePlaced <= maxNumImages
		) {
			let currCluster = cluster[currArrayIndex];
			if (currCluster === undefined) {
				console.log(currCluster, imagePlaced);
				console.log(cluster);
				console.log(
					"total placed:",
					imagePlaced,
					"max:",
					maxNumImages,
					"increment:",
					currArrayIndexIncrementSize
				);
				throw Error();
			}

			// add the grid position directly onto the currCluster object
			// this will copy by reference to the original memory
			currCluster["imagePosition"] = {
				x: currCol * imageWidth,
				y: currRow * imageHeight,
			};

			imagePlaced++; // increment once after each image successfully placed in grid
			currArrayIndex += currArrayIndexIncrementSize; // decides the next item in the array
			flattenedGrid.push(currCluster);

			// increments columns until we need to go to next row
			currCol++;
			if (currCol >= maxNumCols) {
				currCol = 0;
				currRow++;
			}
		}

		return flattenedGrid;
	}

	/**
	 * this function takes a group and renders images on top of it in a grid way
	 * @param {d3.Selection} groupRect
	 * @param {HierarchyNode} d
	 * @param {number} i
	 */
	const renderImages = (groupRect, d, i) => {
		const { x1, x0, y1, y0, cluster } = d;
		let mutatedCluster = cluster;
		// mutatedCluster = mutatedCluster.sort((a, b) => a.index - b.index);
		const imageGrid = gridifyImageArray(
			x0,
			y0,
			x1,
			y1 - labelYSpace,
			imageWidth,
			imageHeight,
			mutatedCluster
		);

		groupRect
			.selectAll("image")
			.data(imageGrid)
			.join("image")
			.attr("id", (d) => `image-${d.instance_index}`)
			.attr("class", (d) =>
				"correct" in d ? (d.correct ? "right" : "wrong") : ""
			)
			.attr("x", (d) => d.imagePosition.x)
			.attr("y", (d) => d.imagePosition.y + labelYSpace)
			.attr("width", imageWidth)
			.attr("height", imageHeight)
			.attr("href", (d) => `${imageFilepath}/${d.filename}`)
			.attr("cursor", "pointer")
			.on("click", function (event, d) {
				exportDataUp(dispatchNames.image.click, d, this, event);
			})
			.attr("clip-path", d.clip)
			.on("mouseenter", function (event, d) {
				exportDataUp(dispatchNames.image.mouseEnter, d, this, event);
			})
			.on("mouseleave", function (event, d) {
				exportDataUp(dispatchNames.image.mouseLeave, d, this, event);
			});
		groupRect.selectAll("image").append("title").text(imageTitleCallback);
	};

	/**
	 * Only job is to position the nodes in group where they need to go in the treemap
	 * @param {d3.Selection} group
	 * @param {HierarchyNode} root
	 */
	function position(group, root) {
		const subGroups = group.selectChildren("g");
		subGroups
			.attr("transform", (d) => {
				if (d.x0 === undefined || d.y0 === undefined) {
					console.log(d);
					throw Error("These must be present to render");
				}
				return `translate(${x(d.x0)},${y(d.y0)})`;
			})
			.select(".treemap-rect")
			.attr("width", (d) => x(d.x1) - x(d.x0))
			.attr("height", (d) => y(d.y1) - y(d.y0));
		subGroups
			.select(".label-text")
			.attr("x", 5)
			.attr("y", 13)
			.attr("pointer-events", "none");
	}

	/**
	 * renders the treemap to the desired group <g></g>
	 * @param {d3.Selection} group
	 * @param {HierarchyNode} root
	 */
	function render(group, root, renderingFunc = currentRenderingMethod) {
		// call the custom treemap function which returns the nodes to render in an array
		/** @type {Node[]}*/
		const nodesToRender = renderingFunc({
			parent: root,
			x0: 0,
			y0: 0,
			x1: width,
			y1: height,
			kClusters: numClustersShowing,
			imageWidth,
			imageHeight,
			innerPadding,
			outerPadding,
			topPadding,
		});

		// renders the groups and labels the leaf nodes with class .leaf
		const node = group
			.selectAll("g")
			.data(nodesToRender)
			.join("g")
			.attr("id", (d) => `g-${d.data.node_index}`)
			.attr("class", (d) => (d.localLeaf ? "leaf" : ""));

		node.append("rect").call(renderTreemapRect, root);
		// I don't want the text to extend past the rectangle, so clip it off
		node.append("clipPath")
			.attr("id", (d) => {
				d.clip = new ID(`clip-${d.data.node_index}`);
				return d.clip.id;
			})
			.append("use")
			.attr("xlink:href", (d) => d.rect.href);
		node.append("text").call(renderLabel);
		// for each <g> that shows a cluster on top, render the images on top
		const currentLeaves = group.selectAll(".leaf"); // local leaves basically
		forEachSelection(currentLeaves, renderImages);

		group.call(position, root);
	}

	function renderTreemapRect(rect, root) {
		const colorByRemainingHeight = (d, i) =>
			(d.rectColor = d3.color(color(d.height))); // function to color the rectangles
		// now create the rectangle

		rect.attr("id", (d) => {
			// this is neccesary to clip/crop the things that extend out of the rectangle (potentially the text)
			// clip-path shows up in a few lines and takes d.rect.href
			d.rect = new ID(`rect-${d.data.node_index}`); // adds id and href property
			return d.rect.id;
		})
			.attr("fill", colorByRemainingHeight) //appends rectColor to d
			.attr("stroke", (d, i) => {
				if (false && i === 0 && d !== formattedDendrogramData) {
					d.strokeColor = d3.color("steelblue").brighter(0.2);
				} else {
					d.strokeColor = d.rectColor.darker(0.2);
				}
				return d.strokeColor;
			})
			.attr("stroke-width", 1.5)
			.attr("class", "treemap-rect")
			.on("click", function (event, child) {
				exportDataUp(dispatchNames.cluster.click, child, this, event);
				const clickedIsLeaf = child.data.leaf;
				// leaves must not be clicked
				if (!clickedIsLeaf) {
					// desired behavior: zoom out when root node is clicked
					const clickedIsRootNode = child === root;
					if (clickedIsRootNode) {
						const prevRoot = prevRoots.pop(); // stack to keep track the roots we click on
						if (prevRoot !== undefined) {
							zoomout({
								from: root,
								to: prevRoot,
							});
						}
					} else {
						function removeRectsAbove(child) {
							// removes nodes that are rendered after the one we clicked on
							// this is done because the animation breaks down for these rectangles
							function removeRenderedHierarchy(parent) {
								let nodeIds = [];
								function _removeRenderedHierarchy(_parent) {
									if (
										_parent.localLeaf ||
										_parent.children === undefined
									)
										return;
									_parent.children.forEach((child) => {
										nodeIds.push(child.data.node_index);
										_removeRenderedHierarchy(child);
									});
								}
								_removeRenderedHierarchy(parent);
								return nodeIds;
							}
							// remove the nodes above and the current node aswell as all the text
							const nodesToRemove =
								removeRenderedHierarchy(child);
							nodesToRemove.forEach((node_index) =>
								d3.select(`#g-${node_index}`).remove()
							);
							d3.select(`#g-${child.data.node_index}`).remove();
						}

						removeRectsAbove(child); //removes rects above the current child
						// node.select("text").remove(); // removes all text labels

						// adds to the stack to show we traversed down here
						// necessary to zoomout
						prevRoots.push(root);
						// then zoomin
						zoomin({
							to: child,
							from: root,
						});
					}
				}
			})
			.on("mouseover", function (event, child) {
				exportDataUp(
					dispatchNames.cluster.mouseEnter,
					child,
					this,
					event
				);
				if (
					child.data !== formattedDendrogramData.data &&
					!child.data.leaf
				) {
					d3.select(this).attr("stroke", "darkgrey");
				}
			})
			.on("mouseout", function (event, child) {
				exportDataUp(
					dispatchNames.cluster.mouseLeave,
					child,
					this,
					event
				);
				if (child.data !== formattedDendrogramData.data) {
					d3.select(this)
						.attr("stroke", child.strokeColor)
						.attr("fill", child.rectColor);
				}
			});
		rect.append("title").text((d, i) => {
			let clusterLabel = ``;
			if (d === root && d !== formattedDendrogramData) {
				clusterLabel = `Click to go back from cluster`;
			} else if (d === formattedDendrogramData) {
			} else if (d.data.leaf) {
				clusterLabel = `Only 1 image, can't go further`;
			} else {
				clusterLabel = `Click to go into cluster`;
			}
			return clusterLabel;
		});
		rect.attr("cursor", (d) =>
			d.data.leaf || d === formattedDendrogramData ? "default" : "pointer"
		);
	}
	function renderLabel(text) {
		text.attr("clip-path", (d) => d.clip)
			.text(clusterLabelCallback)
			.attr("fill", labelColorCallback)
			.style("font-size", labelSizeCallback)
			.attr("class", "label-text");
	}

	// this is absolutely the worst way to do it, fix this later

	function resetWithNewSettings(svg, numClusters, imageSize) {
		svg.selectAll("g").remove();
		init();
	}
	function highlightWrong(
		group,
		showMisclassifications,
		focus,
		{ borderWidth = "1px", borderColor = "red" }
	) {
		function _showingStroke(d, color, width) {
			d.style = `${width} solid ${color}`;
			return d.style;
		}
		function _showingOpacity(d) {
			d.opacity = highlightedOpacity;
			return d.opacity;
		}
		function _hiddenOpacity(d) {
			d.opacity = hiddenOpacity;
			return d.opacity;
		}
		if (group) {
			const wrongImages = group.selectAll(".wrong");
			const rightImages = group.selectAll(".right");
			wrongImages.attr("opacity", _showingOpacity);
			rightImages.attr("opacity", _showingOpacity);
			if (showMisclassifications && group) {
				if (focus) {
					rightImages.attr("opacity", _hiddenOpacity);
				}
				wrongImages.style("outline", (d) =>
					_showingStroke(d, borderColor, borderWidth)
				);
				wrongImages.raise(); // bring to top of rendering
			} else {
				if (focus) {
					rightImages.attr("opacity", _hiddenOpacity);
				}
				wrongImages.style("outline", (d) =>
					_showingStroke(d, "transparent", borderWidth)
				);
			}
			group.selectAll("text").call(renderLabel);
		}
	}

	function onSizeChanges(numClustersShowing, imageWidth, imageHeight) {
		group.selectChildren("g").remove();
		render(group, currentParentCluster);
		highlightWrong(group, outlineMisclassified, focusMisclassified, {
			borderWidth: outlineStrokeWidth,
			borderColor: misclassificationColor,
		});
	}
	$: {
		if (svelteSvg) {
			onSizeChanges(numClustersShowing, imageWidth, imageHeight); // so cursed that this works
		}
	}

	$: {
		if (
			outlineMisclassified !== undefined ||
			focusMisclassified !== undefined
		) {
			highlightWrong(group, outlineMisclassified, focusMisclassified, {
				borderWidth: outlineStrokeWidth,
				borderColor: misclassificationColor,
			});
		}
	}
	let focusedHistory = false;
	$: {
		const toFocusNotEmpty = imagesToFocus.length > 0;
		if (toFocusNotEmpty && svg) {
			highlightImages({
				imageGroup: svg.selectAll("image"),
				instancesToHighlight: imagesToFocus,
				hiddenOpacity,
				highlightedOpacity,
			});
			focusedHistory = true;
		} else if (!toFocusNotEmpty && focusedHistory && svg) {
			resetOpacity({ highlightedOpacity });
		}
	}
</script>

<svg bind:this={svelteSvg} viewbox="-2 -2 {width + 4} {height + 4}" />

<style>
	svg {
		overflow: hidden;
	}
</style>
