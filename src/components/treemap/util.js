import * as d3 from "d3";

/**
 * Generates a color function that changes based on the height of the tree inputted
 * @param {(t: number) => string} colorInterpolateFunc
 * @param {number} totalTreeHeight
 * @param {{offset?: number, reverseColorDirection?: boolean}} config
 * @returns {d3.ScaleSequential} colorGenerator
 */
export function treemapColorGenerator(
	colorInterpolateFunc,
	totalTreeHeight,
	{ offset = 0, reverseColorDirection = false, range = [0, 0.85] } = {}
) {
	let rangeOfTreeLevels = [totalTreeHeight + offset, 0];
	if (reverseColorDirection) rangeOfTreeLevels.reverse();

	const colorGenerator = d3
		.scaleLinear()
		.domain(rangeOfTreeLevels)
		.range(range);
	return (d) => colorInterpolateFunc(colorGenerator(d));
}

/**
 * takes value [0, 1.0] and converts to a percent value string truncated to k decimal points
 * @param {number} normalizedNumber between [0.0, 1.0]
 * @param {number} decimalPoints number of showing decimals
 * @returns {string} outputs as number%
 */
export function toPercent(normalizedNumber, decimalPoints = 2) {
	if (isNaN(normalizedNumber)) return undefined;
	const conversion = normalizedNumber * 100;
	const toString = conversion.toFixed(decimalPoints);
	const formatted = `${toString}%`;

	return formatted;
}

/**
 * traverse and calls a function with the current node, stops at depth or node
 * @param {d3.HierarchyNode} node
 * @param {(currNode: d3.HierarchyNode) => boolean} callback return true to stop early
 * @param {number} stoppingDepth
 */
function traverseDepthwise(node, callback) {
	const shouldReturnEarly = callback(node);
	if (node.children === undefined || shouldReturnEarly) {
		return;
	}
	node.children.forEach((child) => traverseDepthwise(child, callback));
}

/**
 * accumulates the nodes during depthwise traversal of tree
 * @param {d3.HierarchyNode} treemapData root node
 * @param {number} stop stop early at some depth
 * @returns {d3.HierarchyNode[]} array of nodes to be rendered
 */
export function accumulateNodesDepthwise(treemapData, stop = Infinity) {
	let nodes = [];
	const topLevelDepth = treemapData.depth;
	traverseDepthwise(treemapData, (currNode) => {
		nodes.push(currNode);
		const levelsTraversed = currNode.depth - topLevelDepth;
		if (levelsTraversed >= stop) return true; //stop early here
	});

	return nodes;
}

/**
 * Adds the nodes to render while and adding an array of the leave descendents separately
 * @param {d3.HierarchyNode} treemapData
 * @param {number} numShowing
 */
export function accumulateUntilDescendents(treemapData, numShowing = Infinity) {
	/** @type {any[]} */
	let descendents = treemapData.data.descendents;
	let localLeaves = [];
	let localHierarchy = [];

	traverseDepthwise(treemapData, (currNode) => {
		if (descendents.includes(currNode.data.node_index)) {
			localLeaves.push(currNode);
			return true;
		}
		localHierarchy.push(currNode);
	});

	return { localLeaves, localHierarchy };
}

/**
 * Counts things in the classes for the current nodes cluster
 * @param {any[]} cluster
 * @param {string[]} classes
 */
export function countClass(cluster, classes) {
	let classesMap = new Map(
		classes.map((className) => [
			className,
			{
				trueClassCount: 0,
				incorrectCount: 0,
				correctCount: 0,
			},
		])
	);
	cluster.forEach((leafNode) => {
		let currClass = leafNode.true_class;
		let currCount = classesMap.get(currClass);

		if (leafNode.correct) {
			currCount.correctCount++;
		} else if (!leafNode.correct) {
			currCount.incorrectCount++;
		} else {
			throw Error("correct not present on json");
		}

		// this changes the memory in the map so no need to set it again (by reference)
		currCount.trueClassCount++;
	});
	return classesMap;
}

/**
 * Used for clipping/cropping svg. href is needed there
 */
export class ID {
	constructor(id) {
		this.id = id;
		this.href = new URL(`#${id}`, location) + "";
	}
	toString() {
		return "url(" + this.href + ")";
	}
}

/**
 * deep copies an array one by one O(n)
 * @template T
 * @param {T[]} array
 * @returns {T[]}
 */
export function copyArray(array) {
	let cpy = new Array(array.length);
	for (let i = 0; i < array.length; i++) {
		cpy[i] = array[i];
	}
	return cpy;
}

/**
 * Groups by correct and incorrect
 * @template T
 * @param {T[]} cluster
 * @returns {T[]}
 */
export function groupByCorrectPrediction(cluster) {
	const grouping = d3.group(cluster, (d) => d.correct);
	let combined = [];
	if (grouping.has(true)) {
		combined = [...grouping.get(true)];
	}
	if (grouping.has(false)) {
		combined = [...combined, ...grouping.get(false)];
	}
	return combined;
}

/**
 * This iterates for each sub selection within selection and calls the funcToCall on it
 * @param {d3.Selection} selection
 * @param {(group, d, i) => void} funcToCall
 */
export function forEachSelection(selection, funcToCall) {
	selection.each(function (d, i) {
		d3.select(this).call(funcToCall, d, i);
	});
}

function nonZeroItems(array, callback = (item) => item) {
	const nonZeroArray = array.filter((item) => callback(item) !== 0);
	return nonZeroArray;
}
export function classCountsLabel(
	cluster,
	classes,
	{ topK = 3, countCallback } = {}
) {
	const classCountsMap = countClass(cluster, classes);
	const classCountsArray = Array.from(classCountsMap);
	const sortedClassCountsArray = classCountsArray.sort(
		(a, b) => countCallback(b[1]) - countCallback(a[1])
	);
	const highestCounts = sortedClassCountsArray.slice(0, topK);
	const nonZeroHighestCounts = nonZeroItems(highestCounts, (item) =>
		countCallback(item[1])
	);
	let labelString = `Top ${topK} counts: `;
	nonZeroHighestCounts.forEach((classCounts) => {
		const [className, counts] = classCounts;
		labelString += `${className}#${countCallback(counts)}, `;
	});
	const clippedLabel = labelString.slice(0, -2); // remove the comma and space on the last one
	return clippedLabel;
}
