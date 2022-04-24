/**
 * Adds a json key to each node that contains an array
 * of what is in the cluster. The very top parent should include all.
 * @param {d3.HierarchyNode} parent
 * @param {any[]} whatToAddToCluster
 */
export function assignImageClusterToEachNode(
	parent,
	whatToAddToCluster = (node) => node.data
) {
	// parent.parent is null if d3.hierarchy was run on the parent first
	if (parent.parent === undefined)
		throw Error("Must run through d3.hierarchy first");

	// starts from leaves and merges upwards
	// this requires the parent pointer to be present in every node
	const _accumulateUp = (node, initialValue) => {
		// stopping condition
		if (node.parent !== null) {
			if (node.parent.cluster === undefined) {
				node.parent.cluster = [initialValue];
			} else {
				node.parent.cluster.push(initialValue);
			}
			_accumulateUp(node.parent, initialValue);
		}
	};

	// from bottom up, follow the merging and add file to the cluster
	// top has all the files and each leaf should have individual files by the end
	parent.leaves().forEach((leaf) => {
		const value = whatToAddToCluster(leaf);
		leaf.cluster = [value];
		_accumulateUp(leaf, value);
	});
}

/**
 * For quicker indexing if I have the instance id, can get the data in O(1)
 * @param {d3.HierarchyNode[]} treeNodes
 * @returns {Map<number, d3.HierarchyNode>}
 */
export function givenInstanceIdGetLeafNodeMap(treeNodes) {
	let map = new Map();
	treeNodes.forEach((node) => {
		map.set(node.instance_index, node);
	});
	return map;
}
