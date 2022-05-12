import Queue from "./Queue";

function verticalShift(child, shift) {
	child.y0 += shift;
	child.y1 += shift;
}
function horizontalShift(child, shift) {
	child.x0 += shift;
	child.x1 += shift;
}
function horizontalPadding(child, padding) {
	child.x0 += padding;
	child.x1 -= padding;
}
const getWidth = (child) => child.x1 - child.x0;
const getHeight = (child) => child.y1 - child.y0;
function diceHorizontalPadding(childA, childB, padding) {
	const childAWidth = getWidth(childA),
		childBWidth = getWidth(childB);
	const shift = padding / 4;
	if (childAWidth <= padding * 2) {
		horizontalShift(childA, padding / 2);
		horizontalShift(childB, padding / 2);
	} else {
		horizontalPadding(childA, padding);
		horizontalShift(childA, shift);
	}
	if (childBWidth <= padding * 2) {
		horizontalShift(childA, -padding / 2);
		horizontalShift(childB, -padding / 2);
	} else {
		horizontalPadding(childB, padding);
		horizontalShift(childB, -shift);
	}
}
function sliceHorizontalPadding(childA, childB, padding) {
	const childAWidth = getWidth(childA),
		childBWidth = getWidth(childB);
	if (childAWidth <= padding * 2) {
	} else {
		horizontalPadding(childA, padding);
	}
	if (childBWidth <= padding * 2) {
	} else {
		horizontalPadding(childB, padding);
	}
}
function verticalPadding(child, padding) {
	child.y0 += padding;
	child.y1 -= padding;
}
function diceVerticalPadding(childA, childB, padding) {
	const childAHeight = getHeight(childA),
		childBHeight = getHeight(childB);
	if (childAHeight <= padding * 2) {
	} else {
		verticalPadding(childA, padding);
	}
	if (childBHeight <= padding * 2) {
	} else {
		verticalPadding(childB, padding);
	}
}
function sliceVerticalPadding(childA, childB, padding) {
	const childAHeight = getHeight(childA),
		childBHeight = getHeight(childB);
	if (childAHeight <= padding * 2) {
	} else {
		verticalPadding(childA, padding);
	}
	if (childBHeight <= padding * 2) {
	} else {
		verticalPadding(childB, padding);
	}
}
function isPositive(z0, z1) {
	return z1 - z0 >= 0;
}
function isNegative(z0, z1) {
	return !isPositive(z0, z1);
}
function isNegativeArea(child) {
	if (isNegative(child.x0, child.x1) || isNegative(child.y0, child.y1)) {
		return true;
	}
	return false;
}
function paddingLeftSlice(childA, childB, padding) {
	childA.x0 += padding;
	childB.x0 += padding;
}
function paddingRightSlice(childA, childB, padding) {
	childA.x1 -= padding;
	childB.x1 -= padding;
}
function paddingBottomSlice(childA, childB, padding) {
	// top part of the first child
	childA.y1 -= padding / 2;
	childB.y0 -= padding / 2;
	// bottom part of the second child
	childB.y1 -= padding;
}
function paddingTopSlice(childA, childB, padding) {
	childA.y0 += padding;
	childA.y1 += padding / 2;
	childB.y0 += padding / 2;
}
function paddingInnerSlice(childA, childB, padding) {
	const innerShift = padding / 2;
	childA.y1 -= innerShift;
	childB.y0 += innerShift;
}
function paddingOuterSlice(childA, childB, padding) {
	paddingLeftSlice(childA, childB, padding);
	paddingRightSlice(childA, childB, padding);
	paddingBottomSlice(childA, childB, padding);
	paddingTopSlice(childA, childB, padding);
}

function paddingLeftDice(childA, childB, padding) {
	childA.x0 += padding;
	childA.x1 += padding / 2;
	childB.x0 += padding / 2;
}
function paddingRightDice(childA, childB, padding) {
	childB.x1 -= padding;
	childB.x0 -= padding / 2;
	childA.x1 -= padding / 2;
}
function paddingTopDice(childA, childB, padding) {
	childA.y0 += padding;
	childB.y0 += padding;
}
function paddingBottomDice(childA, childB, padding) {
	childA.y1 -= padding;
	childB.y1 -= padding;
}
function paddingOuterDice(childA, childB, padding) {
	paddingLeftDice(childA, childB, padding);
	paddingRightDice(childA, childB, padding);
	paddingBottomDice(childA, childB, padding);
	paddingTopDice(childA, childB, padding);
}
function paddingInnerDice(childA, childB, padding) {
	const innerShift = padding / 2;
	childA.x1 -= innerShift;
	childB.x0 += innerShift;
}

/**
 * lays out a given treemap for two nodes in a slice dice way
 * @param {d3.HierarchyNode} parent
 * @param {number} x0
 * @param {number} y0
 * @param {number} x1
 * @param {number} y1
 * @param {{imageWidth: number, imageHeight: number, topPadding: number, innerPadding: number, outerPadding: number}}
 */
export function binaryLayout(
	parent,
	x0,
	y0,
	x1,
	y1,
	{
		imageWidth = 20,
		imageHeight = 20,
		topPadding = 10,
		innerPadding = 10,
		outerPadding = 10,
	} = {}
) {
	const { value, children } = parent;

	const width = x1 - x0,
		height = y1 - y0;
	// otherwise we can keep splitting
	// if (width < 0 || height < 0) {
	// 	console.log(parent);
	// 	throw Error(`${width}, ${height} are invalid`);
	// }
	const aspectRatio = width / height;
	const shouldDice = aspectRatio >= 1;
	const shouldSlice = aspectRatio < 1; // for readability, but also !shouldDice

	let [childA, childB] = children;

	// how many images fit across the parent in total
	const toInt = (n) => Math.floor(n); // no need for rounding if the start is a multiple of the imgWidth and imgHeight
	const numImagesFit = (ratio, totalImages) => {
		let numImages = toInt(ratio * totalImages);
		if (numImages === 0) numImages = 1;
		return numImages;
	};

	/** @type {{horizontal: number, vertical: number}} */
	let imagesFit = {
		horizontal: toInt(width / imageWidth),
		vertical: toInt(height / imageHeight),
	};
	parent.imagesFit = imagesFit;

	// console.log(parent.imagesFit);

	// padding around
	const limit = imageWidth / 2;
	const addedPadding = imageHeight <= 30 ? limit : 0; // things do weird stuff below 30, this is a bad fix, get to the bottom of the problem!
	const padding = {
		vertical: imageHeight / 2 + addedPadding,
		horizontal: imageWidth / 2 + addedPadding,
	};
	const verticalSpace = topPadding + outerPadding;
	if (shouldDice) {
		// split horizontally
		// need to assign the new layout for each child

		let imagesFitA, imagesFitB;
		if (childA.value < childB.value) {
			imagesFitA = numImagesFit(
				childA.value / parent.value,
				parent.imagesFit.horizontal
			);
			imagesFitB = parent.imagesFit.horizontal - imagesFitA;
		} else {
			imagesFitB = numImagesFit(
				childB.value / parent.value,
				parent.imagesFit.horizontal
			);
			imagesFitA = parent.imagesFit.horizontal - imagesFitB;
		}
		// console.log(imagesFitA, imagesFitB);

		const boxWidthA = imagesFitA * imageWidth;
		const couldntFitAllInB = imagesFitB < parent.imagesFit.horizontal;
		const boxWidthB = couldntFitAllInB
			? width - boxWidthA
			: imagesFitB * imageWidth;
		// console.log(`dice ${parent.data.node_index}`, imagesFitA, imagesFitB);

		// how the xs shift
		childA.x0 = x0;
		childA.x1 = childA.x0 + boxWidthA;
		childB.x0 = childA.x1;
		childB.x1 = childB.x0 + boxWidthB;

		// ys stay the same
		childA.y0 = y0;
		childA.y1 = y1;
		childB.y0 = y0;
		childB.y1 = y1;

		paddingOuterDice(childA, childB, outerPadding);
		paddingInnerDice(childA, childB, innerPadding);
		paddingTopDice(childA, childB, topPadding);

		const childAWidth = childA.x1 - childA.x0;
		if (childAWidth < imageWidth) {
			const shiftBack = imageWidth - childAWidth;
			childB.x0 += shiftBack;
			childA.x1 += shiftBack;
		}
		const childBWidth = childB.x1 - childB.x0;
		if (childBWidth < imageWidth) {
			const shiftBack = imageWidth - childBWidth;
			childB.x0 -= shiftBack;
			childA.x1 -= shiftBack;
		}
		const childBHeight = childB.y1 - childB.y0;
		if (childBHeight < imageHeight + verticalSpace) {
			// change the childB to take up its entire parent space
			paddingOuterDice(childA, childB, -outerPadding);
			paddingInnerDice(childA, childB, -innerPadding);
			paddingTopDice(childA, childB, -topPadding);
		}
		// diceHorizontalPadding(childA, childB, padding.horizontal);
		// diceVerticalPadding(childA, childB, padding.vertical);
	} else if (shouldSlice) {
		// split vertically
		// need to assign the new layout for each child
		let imagesFitA, imagesFitB;
		if (childA.value < childB.value) {
			imagesFitA = numImagesFit(
				childA.value / parent.value,
				parent.imagesFit.vertical
			);
			imagesFitB = parent.imagesFit.vertical - imagesFitA;
		} else {
			imagesFitB = numImagesFit(
				childB.value / parent.value,
				parent.imagesFit.vertical
			);
			imagesFitA = parent.imagesFit.vertical - imagesFitB;
		}

		let boxHeightA = imagesFitA * imageHeight;

		// impossible to top how bad this is
		const couldntFitAllInB = imagesFitB < parent.imagesFit.vertical;
		const boxHeightB = couldntFitAllInB
			? height - boxHeightA + verticalSpace
			: imagesFitB * imageHeight;
		if (couldntFitAllInB) boxHeightA -= verticalSpace;
		// console.log(`slice ${parent.data.node_index}`, imagesFitA, imagesFitB);

		// xs stay the same
		childA.x0 = x0;
		childA.x1 = x1;
		childB.x0 = x0;
		childB.x1 = x1;

		// how the ys shift
		childA.y0 = y0;
		childA.y1 = childA.y0 + boxHeightA;
		childB.y0 = childA.y1;
		childB.y1 = childB.y0 + boxHeightB;

		paddingOuterSlice(childA, childB, outerPadding);
		paddingInnerSlice(childA, childB, innerPadding);
		paddingTopSlice(childA, childB, topPadding);
		const childAHeight = childA.y1 - childA.y0;
		if (childAHeight < imageHeight + verticalSpace) {
			// change the childB to take up its entire parent space
			const shiftBack = imageHeight + verticalSpace - childAHeight;
			childB.y0 += shiftBack;
			childA.y1 += shiftBack;
		}
		const childBHeight = childB.y1 - childB.y0;
		if (childBHeight < imageHeight + verticalSpace) {
			// change the childB to take up its entire parent space
			const shiftBack = imageHeight + verticalSpace - childBHeight;
			childB.y0 -= shiftBack;
			childA.y1 -= shiftBack;
		}

		const childBWidth = childB.x1 - childB.x0;
		if (childBWidth < imageWidth) {
			paddingOuterSlice(childA, childB, -outerPadding);
			paddingInnerSlice(childA, childB, -innerPadding);
			paddingTopSlice(childA, childB, -topPadding);
		}
		// sliceHorizontalPadding(childA, childB, padding.horizontal);
		// sliceVerticalPadding(childA, childB, padding.vertical);
	} else {
		throw Error("Should slice or dice, no other option :P");
	}

	// // top additional padding
	// verticalShift(childA, topPadding);
	// verticalShift(childB, topPadding);
}
const hasNegativeDims = (node, xMin = 0, yMin = 0) =>
	node.x1 - node.x0 < xMin || node.y1 - node.y0 < yMin;

function canFitChildrenFunc({
	imageWidth,
	imageHeight,
	innerPadding,
	outerPadding,
	topPadding,
}) {
	const canFitVertical =
		2 * imageHeight + 3 * topPadding + 2 * outerPadding + innerPadding;
	const canFitHorizontal = 2 * imageWidth + innerPadding + 2 * outerPadding;
	const _canFitFunc = (currParent) => {
		return hasNegativeDims(currParent, canFitHorizontal, canFitVertical);
	};
	return _canFitFunc;
}

function isGlobalLeaf(node) {
	return node.children === undefined || node.children.length === 0;
}

/**
 * lays out the given root node until a certain number are hit
 * @param {{parent: d3.HierarchyNode, x0: number, y0: number, x1: number, y1: number, kClusters?: number
 * paddingTop?: number}} treemapParams
 * @param {(node: d3.HierarchyNode, x0: number, y0: number, x1: number, y1: number) => void} layoutCallback
 */
export function kClustersTreeMap(
	{
		parent,
		x0,
		y0,
		x1,
		y1,
		kClusters = Infinity,
		imageWidth = 20,
		imageHeight = 20,
		innerPadding = 10,
		outerPadding = 10,
		topPadding = 10,
	} = {},
	layoutCallback = binaryLayout
) {
	// set the parent width and height
	parent.x0 = x0;
	parent.y0 = y0;
	parent.x1 = x1;
	parent.y1 = y1;

	// create queue
	let queue = new Queue();

	// add the root node to start
	queue.push(parent);
	let clustersShowing = 1;
	let toRender = [parent];
	const canFitChildren = canFitChildrenFunc({
		imageHeight,
		imageWidth,
		innerPadding,
		outerPadding,
		topPadding,
	});

	// while the queue is not empty and still need to place more items
	breadthFirst: while (!queue.isEmpty() && clustersShowing < kClusters) {
		// pop queue as the current parent
		let currParent = queue.pop();

		currParent.localLeaf = false;
		if (isGlobalLeaf(currParent) || canFitChildren(currParent)) {
			currParent.localLeaf = true;
			continue breadthFirst;
		} // check if we have a leaf node and can't go any further on this side

		// layout the boxes given the current parents children
		layoutCallback(
			currParent,
			currParent.x0,
			currParent.y0,
			currParent.x1,
			currParent.y1,
			{ imageHeight, imageWidth, innerPadding, topPadding, outerPadding }
		);
		clustersShowing++;

		// add the children to the queue
		childIter: for (let i = 0; i < currParent.children.length; i++) {
			if (clustersShowing > kClusters) break childIter; // if we already placed enough clusters, break out

			// to iterate these next add them to the queue
			const child = currParent.children[i];
			queue.push(child);
			toRender.push(child);
			child.localLeaf = true;
		}
	}
	return toRender;
}

/**
 * lays out the given root node until a certain number are hit not left to right, but by merge distance (normal way to cut dendrogram up)
 * @param {{parent: d3.HierarchyNode, x0: number, y0: number, x1: number, y1: number, kClusters?: number
 * paddingTop?: number, layoutCallback: (node: d3.HierarchyNode, x0: number, y0: number, x1: number, y1: number) => void, sortOrder: (a, b) => number, init: (root: d3.HierarchyNode) => void}} treemapParams
 */
export function sortingKClustersTreeMap({
	parent,
	x0,
	y0,
	x1,
	y1,
	kClusters = Infinity,
	imageWidth = 20,
	imageHeight = 20,
	innerPadding = 10,
	outerPadding = 10,
	topPadding = 10,
	layoutCallback = binaryLayout,
	sortOrder = (a, b) => b.merging_distance - a.merging_distance,
} = {}) {
	// set the parent width and height
	parent.x0 = x0;
	parent.y0 = y0;
	parent.x1 = x1;
	parent.y1 = y1;

	// create queue

	// add the root node to start
	let clustersShowing = 1;
	let toRender = [parent];
	let traversalOrder = [parent];
	const canFitChildren = canFitChildrenFunc({
		imageHeight,
		imageWidth,
		innerPadding,
		outerPadding,
		topPadding,
	});

	layouter: while (traversalOrder.length > 0 && clustersShowing < kClusters) {
		traversalOrder = traversalOrder.sort((a, b) =>
			sortOrder(a.data, b.data)
		);
		const currParent = traversalOrder.pop();
		currParent.localLeaf = false;
		if (isGlobalLeaf(currParent) || canFitChildren(currParent)) {
			currParent.localLeaf = true;
			continue layouter;
		}

		layoutCallback(
			currParent,
			currParent.x0,
			currParent.y0,
			currParent.x1,
			currParent.y1,
			{ imageHeight, imageWidth, innerPadding, topPadding, outerPadding }
		);
		clustersShowing++;

		const children = currParent.children;
		childIter: for (let i = 0; i < children.length; i++) {
			if (clustersShowing > kClusters) break childIter;
			const child = children[i];

			traversalOrder.push(child);
			child.localLeaf = true;
			toRender.push(child);
		}
	}
	return toRender;
}
