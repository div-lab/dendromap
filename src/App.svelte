<script>
	import { hierarchy } from "d3";
	import {
		assignImageClusterToEachNode,
		givenInstanceIdGetLeafNodeMap as IdToLeafNodeMap,
	} from "./util";
	import { ScaleOut } from "svelte-loading-spinners";
	import { imagesEndpoint } from "./stores/endPoints";
	import {
		globalClasses,
		globalLeafNodesObject,
	} from "./stores/globalDataStore";
	import {
		treemapNumClusters,
		treemapImageSize,
		hasClasses,
		hasTrueClass,
		hasPredictedClass,
		hasSimilar,
		hasAccuracy,
		selectedImage,
		imagesToHighlight,
		highlightSimilarImages,
		highlightIncorrectImages,
		showMisclassifications,
		selectedParent,
	} from "./stores/sidebarStore";

	import Sidebar from "./components/Sidebar.svelte";
	import DendroMap from "./components/treemap/DendroMap.svelte";
	import GithubIcon from "./components/misc/GithubIcon.svelte";
	import PaperIcon from "./components/misc/PaperIcon.svelte";
	import ArticleSidebar from "./components/article/ArticleSidebar.svelte";

	// check (stores/globalDataStore.js for more info.)
	function storeDataGlobally({ classes, leafNodes, leafIdMap, rootNode }) {
		globalLeafNodesObject.set({ idMap: leafIdMap, array: leafNodes });
		globalClasses.set(classes);
	}

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
		let hierarchicalData = hierarchy(tree).sum((d) => d.value);
		let leafNodes = hierarchicalData.leaves().map((leaf) => leaf.data);
		let leafIdMap = IdToLeafNodeMap(leafNodes);
		assignImageClusterToEachNode(hierarchicalData); // creates a cluster property on each node in the tree

		return { leafIdMap, leafNodes, hierarchicalData };
	}
	async function formatAndStoreDendrogram(tree, classes) {
		const { leafIdMap, leafNodes, hierarchicalData } = processData(tree);
		// change the visualization based on provided information
		const firstLeafNode = leafNodes[0];
		hasSimilar.set("similar" in firstLeafNode);
		hasPredictedClass.set("predicted_class" in firstLeafNode);
		hasTrueClass.set("true_class" in firstLeafNode);
		hasAccuracy.set("accuracy" in firstLeafNode);
		let hasClassesValue = classes !== undefined;
		hasClasses.set(hasClassesValue);
		if (hasClassesValue) {
			treeClasses = classes;
		}
		dendrogramData = hierarchicalData;
		let output = {
			classes: treeClasses,
			rootNode: dendrogramData,
			leafNodes,
			leafIdMap,
		};

		storeDataGlobally(output);
		imagesEndpoint.set(selectedOption.image_filepath);
	}
	async function fetchData() {
		showTreemap = await false;
		if (dataCache === null) {
			const res = await fetch(selectedOption.cluster_filepath);
			const data = await res.json();
			dataCache = data;
		}
		console.log(selectedOption.image_filepath);
		await formatAndStoreDendrogram(
			dataCache.tree,
			dataCache.classes ?? undefined
		);
		showTreemap = await true;
	}
	async function fetchClassedData(selectedClass) {
		showTreemap = await false;
		classClusteringsPresent = false;
		if (!(selectedClass in classedDataCache)) {
			const res = await fetch(selectedOption.class_cluster_filepath);
			const data = await res.json();
			classedDataCache = {};
			data["classes"].forEach((class_name) => {
				const tree = data[class_name];
				classedDataCache[class_name] = {
					tree,
					classes: data["classes"],
				};
			});
		}
		const selectedData = classedDataCache[selectedClass];
		formatAndStoreDendrogram(selectedData.tree, selectedData.classes);
		classClusteringsPresent = true;
		showTreemap = await true;
	}
	function silenceConsoleLogs() {
		console.log("console log is silenced 😴");
		console.log = () => {};
	}

	// props
	export let options; // settings you can change in main.js that shows up in the dropdown in the sidebar

	// vars
	let selectedOptionIndex = 0;
	let selectedOption;
	$: {
		selectedOption = options[selectedOptionIndex];
		classedDataCache = {};
		dataCache = null;
	}

	let classedDataCache = {};
	let dataCache = null;
	let currentParentCluster = null;

	// indicators of when things are done or if we have a certain item
	let changedDataset = false;
	let articleOpen = true;
	let showTreemap = false;
	let classClusteringsPresent;

	// dendromap dimension size
	const screen = {
		width: document.body.clientWidth,
		height: document.body.clientHeight,
	};

	// app variables for data
	let dendrogramData;
	let treeClasses;

	// on change of the dataset update the dataset
	$: {
		const updateSelection = async (index) => {
			changedDataset = await true;
			await fetchData(index);
			changedDataset = await false;
		};
		updateSelection(selectedOptionIndex);
	}
	$: {
		selectedParent.set(currentParentCluster);
	}
</script>

<div id="top-bar">
	<div id="title"><code>DendroMap</code></div>
	<div id="links" style="gap: 15px; margin-top:6px;">
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
			<Sidebar
				on:filterClass={async (e) => {
					const className = e.detail;
					showTreemap = await false;
					if (className === null) {
						await fetchData();
					} else {
						await fetchClassedData(className);
					}
					console.log(e.detail);
					showTreemap = await true;
				}}
				classes={treeClasses}
				{options}
				bind:selectedOption={selectedOptionIndex}
				bind:articleSidebarOpen={articleOpen}
				{changedDataset}
			/>
		</div>
		<div id="vis">
			{#if showTreemap}
				<DendroMap
					{dendrogramData}
					imageFilepath={selectedOption.image_filepath}
					imageWidth={$treemapImageSize}
					imageHeight={$treemapImageSize}
					width={Math.max(screen.width - 600, 600)}
					height={835}
					renderingMethod={"breadth"}
					numClustersShowing={$treemapNumClusters}
					imagesToFocus={$imagesToHighlight}
					outlineMisclassified={$showMisclassifications}
					focusMisclassified={$highlightIncorrectImages}
					clusterLabelCallback={(d) => {
						let totalLabel = `${d.data.node_count} image${
							d.data.node_count > 1 ? "s" : ""
						}`;
						if ($hasAccuracy) {
							totalLabel += `, ${(d.data.accuracy * 100).toFixed(
								2
							)}% accuracy`;
						}
						return totalLabel;
					}}
					imageTitleCallback={(d) => {
						let titleMsg = `Click to select image ${d.instance_index}`;
						if ($hasTrueClass) {
							titleMsg += `\ntrue class: ${d.true_class}`;
						}
						if ($hasPredictedClass) {
							titleMsg += `\npred class: ${d.predicted_class}`;
						}
						return titleMsg;
					}}
					bind:currentParentCluster
					on:imageClick={(e) => {
						const { data, el, event } = e.detail;
						selectedImage.set(data); // pass to the sidebar
					}}
					on:imageMouseEnter={(e) => {
						const { data, el, event } = e.detail;
						if ($highlightSimilarImages) {
							imagesToHighlight.set([
								data.instance_index,
								...data.similar,
							]);
						}
					}}
					on:imageMouseLeave={(e) => {
						const { data, el, event } = e.detail;
						if ($highlightSimilarImages) {
							imagesToHighlight.set([]);
						}
					}}
					on:clusterClick={(e) => {
						// const { data, el, event } = e.detail;
					}}
					on:clusterMouseEnter={({ detail }) => {
						// const { data, el, event } = e.detail;
					}}
					on:clusterMouseLeave={({ detail }) => {
						// const { data, el, event } = e.detail;
					}}
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
		height: 850px;
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
