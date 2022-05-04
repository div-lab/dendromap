<script>
	import Sidebar from "./components/Sidebar.svelte";
	import Article from "./components/article/Article.svelte";
	import { ScaleOut } from "svelte-loading-spinners";
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
	import GithubIcon from "./components/misc/GithubIcon.svelte";
	import PaperIcon from "./components/misc/PaperIcon.svelte";
	import Icon from "./components/misc/Icon.svelte";
	import ArticleSidebar from "./components/article/ArticleSidebar.svelte";

	/**
	 * Formats the data through d3.hierarchy and creates cluster arrays with the given
	 * Cluster for each node. This is used heavily in the OurTreemap.svelte.
	 * @param {object} rootNode
	 * @param {object[]} treeNodes
	 */
	function formatForOurTreemap(rootNode, treeNodes, treeClasses) {
		console.log(rootNode);
		console.log(treeNodes);
		console.log(treeClasses);
		let hierarchicalData = d3.hierarchy(rootNode).sum((d) => d.value);
		console.log("here", hierarchicalData.leaves());
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
		console.log(hierarchicalData, leafNodes);
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

	export let options;
	let selectedOption = 0;
	console.log(options);

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

	function processData(tree) {
		function forEachLeaf(parent, callback) {
			if (parent.leaf) {
				callback(parent);
				return;
			}
			parent.children.forEach((child) => {
				forEachLeaf(child, callback);
			});
		}
		// remove this by init value as 1 for leaves in python
		forEachLeaf(tree, (node) => {
			node.value = 1;
			node.correct = node.correct_count === 1;
		});
		let hierarchicalData = d3.hierarchy(tree).sum((d) => d.value);
		let leafNodes = hierarchicalData.leaves().map((leaf) => leaf.data);
		let leafIdMap = IdToLeafNodeMap(leafNodes);
		assignImageClusterToEachNode(hierarchicalData); // creates a cluster property on each node in the tree

		return { leafIdMap, leafNodes, hierarchicalData };
	}
	let hasSimilar, hasPredictedClass, hasTrueClass, hasClasses;
	async function fetchData(option) {
		root = undefined;
		const selected = options[option];
		const res = await fetch(selected.cluster_filepath);
		const data = await res.json();
		const { leafIdMap, leafNodes, hierarchicalData } = processData(
			data.tree
		);

		// change the visualization based on provided information
		hasSimilar = "similar" in leafNodes[0];
		hasPredictedClass = "predicted_class" in leafNodes[0];
		hasTrueClass = "true_class" in leafNodes[0];
		hasClasses = "classes" in data;
		if (hasClasses) {
			treeClasses = data.classes;
		}
		root = hierarchicalData;
		let output = {
			classes: treeClasses,
			rootNode: root,
			leafNodes,
			leafIdMap,
		};

		storeDataGlobally(output);
		imagesEndpoint.set(selected.image_filepath);
	}

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
		// silenceConsoleLogs();
		// await fetchData(0);
	});

	$: {
		const updateSelection = async (index) => {
			changedDataset = await true;
			await fetchData(index);
			changedDataset = await false;
		};
		updateSelection(selectedOption);
	}
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
	// $: {
	// 	const a = async () => {
	// 		changedDataset = await true;
	// 		switch (selectedDataset) {
	// 			case "cifar10":
	// 				await selectCifar10();
	// 				break;
	// 			case "cifar100":
	// 				await selectCifar100();
	// 				break;
	// 			default:
	// 				break;
	// 		}
	// 		changedDataset = await false;
	// 	};
	// 	a();
	// }
	const screen = {
		width: document.body.clientWidth,
		height: document.body.clientHeight,
	};
	let articleOpen = true;
	const toggleSidebarArticle = () => (articleOpen = !articleOpen);
</script>

<div id="top-bar">
	<div id="title"><code>DendroMap</code></div>
	<div id="links" style="gap: 15px; margin-top:6px;">
		<!-- <a title="Take me to the explanation.">
			<button
				on:click={toggleSidebarArticle}
				style="font-weight:700; cursor:pointer;"
			>
				What's the point of <code>DendroMap</code>?</button
			>
		</a> -->
		<div title="Take me to the code." style="">
			<a href="https://github.com/div-lab/dendromap" target="_blank">
				<GithubIcon height={25} fill="white" />
			</a>
		</div>
		<div title="Take me to the research paper." style="">
			<a href="https://arxiv.org/" target="_blank">
				<PaperIcon height={25} fill="white" />
			</a>
		</div>
	</div>
</div>

<div>
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
					{options}
					bind:selectedOption
					classNames={[]}
					on:selectVis={({ detail }) => {
						selectedVisualization = detail;
					}}
					bind:articleSidebarOpen={articleOpen}
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
				<OurTreemap
					width={Math.max(screen.width - 600, 800)}
					height={$totalHeight}
				/>
			{:else}
				<div style="display:flex; gap:10px; align-items:center;">
					<h1 style="margin:0;padding:0;color: #00000020;">
						Loading Data
					</h1>
					<ScaleOut size="40" color="#333333" unit="px" />
				</div>
			{/if}
		</div>
	</div>
	<ArticleSidebar bind:open={articleOpen} />
</div>

<style>
	#top-bar {
		width: 100%;
		height: 25px;
		background-color: var(--dark-grey);
		padding-top: 10px;
		padding-bottom: 10px;
		display: flex;
		align-items: center;
		/* border-bottom: 1.5px solid hsla(0, 0%, 0%, 0.1); */
	}
	#title {
		color: white;
		font-size: 25px;
		font-weight: 600;
		margin-left: 20px;
		margin-top: -4px;
	}
	#main {
		display: flex;
		height: 925px;
		border-bottom: 1.5px solid #00000010;
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
		right: 25px;
	}
	#vis {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
