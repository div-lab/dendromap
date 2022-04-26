<script>
	import Sidebar from "./components/Sidebar.svelte";
	import * as d3 from "d3-hierarchy";
	import { onMount } from "svelte";
	import { clustersEndPoint, imagesEndpoint } from "./stores/endPoints";
	import {
		globalClasses,
		globalLeafNodesObject,
		globalRootNode,
	} from "./stores/globalDataStore";
	import {
		assignImageClusterToEachNode,
		givenInstanceIdGetLeafNodeMap as IdToLeafNodeMap,
	} from "./util";
	import { totalHeight } from "./stores/sidebarStore";
	import OurTreemap from "./components/treemap/OurTreemap.svelte";
	import Icon from "./components/misc/Icon.svelte";

	/**
	 * Formats the data through d3.hierarchy and creates cluster arrays with the given
	 * Cluster for each node. This is used heavily in the OurTreemap.svelte.
	 * @param {object} rootNode
	 * @param {object[]} treeNodes
	 */
	function formatForOurTreemap(rootNode, treeNodes, treeClasses) {
		let hierarchicalData = d3.hierarchy(rootNode).sum((d) => d.value);
		let leafNodes = treeNodes.filter((node) => node.is_leaf);
		const leafIdMap = IdToLeafNodeMap(leafNodes);
		assignImageClusterToEachNode(hierarchicalData, ({ data }) => {
			let leafNode = leafIdMap.get(data.instance_index);
			if ("true_class_no" in data && "predicted_class_no" in data) {
				leafNode.true_class = treeClasses[data.true_class_no];
				leafNode.predicted_class = treeClasses[data.predicted_class_no];
			} else {
				leafNode.predicted_class = data.predicted_class;
				leafNode.true_class = data.true_class;
			}
			leafNode.correct = leafNode.predicted_class === leafNode.true_class;

			// remove the things that don't make sense on leaves
			delete leafNode["confusion"];
			delete leafNode["ongoing"];
			delete leafNode["descendents_parents"];
			delete leafNode["node_count"];

			return leafNode;
		});
		return [hierarchicalData, leafNodes, leafIdMap];
	}

	// check (stores/globalDataStore.js for more info.)
	function storeDataGlobally({ classes, leafNodes, leafIdMap, rootNode }) {
		globalLeafNodesObject.set({ idMap: leafIdMap, array: leafNodes });
		globalClasses.set(classes);
		globalRootNode.set(rootNode);
	}

	/**
	 * Takes tree results datafile and formats + stores it to be used for our visualizations
	 * @param {JSON} treeResults
	 */
	function formatAndStoreData(treeResults) {
		const treeKey = "tree",
			nodesKey = "nodes",
			classesKey = "classes";
		if (
			!(
				treeKey in treeResults &&
				nodesKey in treeResults &&
				classesKey in treeResults
			)
		) {
			throw Error(
				`One of these keys are missing: ${treeKey}, ${nodesKey}, ${classesKey} from the json.`
			);
		}
		treeData = treeResults.tree;
		treeNodes = treeResults.nodes;
		treeClasses = treeResults.classes;

		// format the data for use in our treemap
		let givenIdReturnsLeafNodeMap, leafNodes;
		[root, leafNodes, givenIdReturnsLeafNodeMap] = formatForOurTreemap(
			treeData,
			treeNodes,
			treeClasses
		);

		// then expose those globally so no need to pass as props anywhere
		// instead just import each global variable (check stores/globalDataStore.js)
		let output = {
			classes: treeClasses,
			rootNode: root,
			leafNodes,
			leafIdMap: givenIdReturnsLeafNodeMap,
		};
		storeDataGlobally(output);
		return output;
	}

	let validDatasets = [
		"cifar10",
		"cats_vs_dogs",
		"oxford_flowers102",
		"cifar100",
		"imagenet",
	];
	let validVisualizations = [
		"treemap",
		"grid",
		"binary",
		"d3-default",
		"dendrogram",
	];

	// default settings
	let selectedVisualization = "treemap";
	let selectedDataset = "cifar100";
	let sampleCount = 0;
	let modelName = "resnet50";
	let fileFormatVersion = 81;
	let setName = undefined;

	// props from main.js
	export let pathToDir;
	export let clustersSubDirName;
	export let classClustersSubDirName;
	export let imagesSubDirName;

	function datasetSelector({
		name,
		model,
		layersCountingBackwards,
		fileFormat = "8",
	} = {}) {
		return async () => {
			root = undefined;
			classClusteringsPresent = false;

			// main selection
			selectedDataset = name;
			modelName = model;
			fileFormatVersion = +`${fileFormat}${layersCountingBackwards}`;

			classClusteringsPresent = true;
			await loadAllClustering();
		};
	}

	const selectCifar100 = datasetSelector({
		name: "cifar100",
		model: "resnet50",
		layersCountingBackwards: 1,
	});

	const selectCifar10 = datasetSelector({
		name: "cifar10",
		model: "resnet50",
		layersCountingBackwards: 2,
	});

	// app variables for data
	let root;
	let HACDataFilename = "";
	let datafile;
	let treeData;
	let treeNodes;
	let treeClasses;
	let valueSet, valueInterface, valueTask;

	// load the data and store in the global variables for use in the treemap
	onMount(async () => {
		silenceConsoleLogs();
	});

	let classClusteringsPresent;
	let useGCPImages = true;
	async function loadPrecomputedClassClustering(classIndex) {
		root = undefined;
		clustersEndPoint.set(
			`${pathToDir}${selectedDataset}/${classClustersSubDirName}`
		);
		classClusteringsPresent = false;
		// changes from loadAllClustering here
		HACDataFilename = `${$clustersEndPoint}/${classIndex}_result_tree_and_nodes_${modelName}_${sampleCount}_${fileFormatVersion}.json`;
		if (setName !== undefined) {
			HACDataFilename = `${$clustersEndPoint}/${classIndex}_result_tree_and_nodes_${modelName}_${sampleCount}_${fileFormatVersion}_${setName}.json`;
		}
		// changes from loadAllClustering ^

		console.log(HACDataFilename);
		const res = await fetch(HACDataFilename);
		datafile = await res.json();
		formatAndStoreData(datafile); // check the contents to see what data is stored
		classClusteringsPresent = true;
	}
	async function loadAllClustering() {
		root = undefined;
		clustersEndPoint.set(
			`${pathToDir}/${selectedDataset}/${clustersSubDirName}`
		);
		imagesEndpoint.set(
			useGCPImages
				? `${pathToDir}/${selectedDataset}/${imagesSubDirName}`
				: `images`
		);
		HACDataFilename = `${$clustersEndPoint}/result_tree_and_nodes_${modelName}_${sampleCount}_${fileFormatVersion}.json`;
		if (setName !== undefined) {
			HACDataFilename = `${$clustersEndPoint}/result_tree_and_nodes_${modelName}_${sampleCount}_${fileFormatVersion}_${setName}.json`;
		}
		console.log(HACDataFilename);
		const res = await fetch(HACDataFilename);
		datafile = await res.json();
		formatAndStoreData(datafile); // check the contents to see what data is stored
	}

	function silenceConsoleLogs() {
		console.log("console log is silenced 😴");
		console.log = () => {};
	}

	let changedDataset = false;
	$: {
		const a = async () => {
			changedDataset = await true;
			switch (selectedDataset) {
				case "cifar10":
					await selectCifar10();
					break;
				case "cifar100":
					await selectCifar100();
					break;
				default:
					break;
			}
			changedDataset = await false;
		};
		a();
	}
</script>

<div id="top-bar">
	<div id="title"><code>DendroMap</code></div>
	<div id="links" style="gap: 15px; margin-top:4px;">
		<button style="font-weight:700; height: 20px;"
			>How to use <code>DendroMap</code></button
		>
		<div title="Take me to the code.">
			<a href="https://github.com/div-lab/dendromap" target="_blank">
				<!-- <i class="fab fa-github" style="font-size:25px;" /> -->
				<Icon name="github" />
			</a>
		</div>
		<div title="Take me to the research paper.">
			<a href="https://github.com/div-lab/dendromap" target="_blank">
				<!-- <i class="fab fa-youtube" style="font-size:25px;" /> -->
				<Icon name="paper" />
			</a>
		</div>
	</div>
</div>
<div id="main">
	<div id="sidebar">
		{#if selectedVisualization}
			<Sidebar
				on:filterClass={(e) => {
					if (e.detail === null) {
						loadAllClustering();
					} else {
						loadPrecomputedClassClustering(e.detail);
					}
				}}
				classes={treeClasses}
				classNames={[]}
				on:selectVis={({ detail }) => {
					selectedVisualization = detail;
				}}
				visualizationOptions={validVisualizations}
				initialVisualizationChoice={selectedVisualization}
				{modelName}
				bind:selectedDataset
				{classClusteringsPresent}
				task={valueTask}
				_interface={valueInterface}
				set={valueSet}
				{changedDataset}
			/>
		{/if}
	</div>
	<div id="vis">
		{#if root}
			<OurTreemap width={$totalHeight} height={$totalHeight} />
		{:else}
			<p>Loading dataset...</p>
		{/if}
	</div>
</div>

<style>
	#top-bar {
		width: 100%;
		height: 15px;
		background-color: var(--dark-grey);
		padding-top: 10px;
		padding-bottom: 10px;
		display: flex;
		align-items: center;
		border-bottom: 1.5px solid hsla(0, 0%, 0%, 0.1);
	}
	#title {
		color: white;
		font-size: 20px;
		font-weight: 600;
		margin-left: 20px;
		margin-top: -4px;
	}
	#main {
		display: flex;
	}
	#sidebar {
		--width: 550px;
		width: var(--width);
		max-width: var(--width);
		min-width: var(--width);
	}
	code {
		font-family: monospace;
	}
	#links {
		display: flex;
		color: white;
		position: absolute;
		right: 30px;
	}
</style>
