<script>
	import { createEventDispatcher } from "svelte";
	import {
		selectedParent,
		nodeHovering,
		selectedImage,
		showMisclassifications,
		showAsGrid,
		treemapImageSize,
		treemapNumClusters,
		highlightSimilarImages,
		zoomedOutGridDimensions,
		zoomedInGridDimensions,
		currentNodesShowing,
		currentClassFilter,
		changingSizes,
		maxGrids,
		isZoomedIn,
		hideClassTable,
		hideSimilarMode,
		hideClassFilter,
		hideMisclassifiedImages,
		highlightIncorrectImages,
		updateZoomDimensions,
		hideGlobalDetails,
		showUserStudyParameters,
		hasClasses,
		hasSimilar,
		hasPredictedClass,
		imagesToHighlight,
	} from "../stores/sidebarStore";
	import { imagesEndpoint } from "../stores/endPoints";
	import Label from "./sidebarComponents/Label.svelte";
	import ClassTable from "./classTable/ClassTable.svelte";
	import SimilarImages from "./SimilarImages.svelte";
	import SearchableSelect from "./SearchableSelect.svelte";
	import BigLabel from "./sidebarComponents/BigLabel.svelte";
	import Switch from "./sidebarComponents/Switch.svelte";
	import Slider from "./sidebarComponents/Slider.svelte";
	import HelpIcon from "./misc/HelpIcon.svelte";
	import Name from "./article/Name.svelte";

	const dispatch = createEventDispatcher();

	export let classNames;
	export let classes;
	export let name = "Error Browser";
	export let modelName;
	export let selectedDataset;
	export let animateClassTable = false;
	export let articleSidebarOpen = false;
	export let options;
	export let selectedOption;

	// optional if we are in the user study
	export let task;
	export let set;
	export let _interface;
	export let changedDataset = false;

	$: cpyClasses = classes ? classes.map((className) => className) : [];
	const copyClasses = () =>
		classes ? classes.map((className) => className) : [];

	function clickClassName(className) {
		dispatch("clickClassName", {
			className: className,
		});
	}
	export let visualizationOptions = [];
	export let classClusteringsPresent;
	export let initialVisualizationChoice = "treemap";
	let selectedVisualization = initialVisualizationChoice;

	$: {
		dispatch("selectVis", selectedVisualization);
	}

	// treemap settings
	let numClusters = 8;
	let imageSize = $treemapImageSize > 0 ? $treemapImageSize : 35;

	async function updateSetting(imageSize, numClusters) {
		await changingSizes.set(true);
		await treemapImageSize.set(imageSize);
		await treemapNumClusters.set(numClusters);
		await changingSizes.set(false);
	}
	$: {
		updateSetting(imageSize, numClusters);
	}
	// baseline settings
	let zoomedOutDims = $zoomedOutGridDimensions
		? $zoomedOutGridDimensions
		: 40;
	updateZoomDimensions(zoomedOutDims);
	$: {
		if (classClusteringsPresent) {
			zoomedOutDims = $zoomedOutGridDimensions;
		}
	}
</script>

<div id="sidebar" style="">
	<div
		class="sidebar-item"
		style="display: flex; justify-content: start; text-transform: capitalize; padding-top: 0; gap: 40px;"
	>
		<div>
			<button
				class="help-button"
				style="margin:0; margin-top:10px; padding:0; padding-left: 10px; padding-right:10px; height: 40px; text-align: center;"
				on:click={() => {
					articleSidebarOpen = !articleSidebarOpen;
				}}
			>
				<b>Open Article</b>: What is <Name />?
			</button>
		</div>
		{#if !$hideGlobalDetails}
			<Label outerDivStyle="width: 150px;" label="Dataset">
				<select
					bind:value={selectedOption}
					on:change={() => {
						selectedImage.set(null);
						currentClassFilter.set(null);
						showMisclassifications.set(false);
						highlightIncorrectImages.set(false);
						highlightSimilarImages.set(false);
						imagesToHighlight.set([]);
					}}
				>
					{#each options as option, i}
						<option value={i}
							>{option.dataset} {option.model}</option
						>
					{/each}
				</select>
			</Label>
			<!-- <Label outerDivStyle="width: 95px;" label="Model"
				>{modelName === "resnet50" ? "ResNet50" : modelName}</Label
			> -->
		{:else}
			<Label outerDivStyle="width: 100px;" label="Current Task"
				>task {task}</Label
			>
			{#if $showUserStudyParameters}
				<div style="margin-top: 5px; padding:0;">
					{#if +task !== 7}
						<a
							href="/?interface={_interface}&set={set}&task={+task +
								1}"
						>
							<button style="margin: 0;"
								>Click to go to next Task {+task + 1}</button
							>
						</a>
					{:else}
						<button disabled style="margin: 0;"
							>No more tasks</button
						>
					{/if}
				</div>
			{/if}
		{/if}
	</div>
	<div class="hor-line" />

	<div class="sidebar-item" id="visualization-settings">
		<BigLabel label="Settings">
			<div class="row">
				{#if !$hideClassFilter}
					{#if $hasClasses}
						<Label
							outerDivStyle="width: 120px;"
							label="Class Filter"
						>
							<SearchableSelect
								on:select={(e) => {
									const selectedClass = e.detail.value;
									currentClassFilter.set(selectedClass);
									selectedImage.set(null);
									dispatch("filterClass", selectedClass);
								}}
								on:clear={() => {
									currentClassFilter.set(null);
									selectedImage.set(null);
									dispatch("filterClass", null);
								}}
								style=""
								bind:value={$currentClassFilter}
								placeholder="Filter..."
								items={cpyClasses ? cpyClasses : []}
								initialValue={$currentClassFilter}
								isClearable
								onlyValuesNoLabels
							/>
						</Label>
					{/if}
				{/if}
				{#if selectedVisualization === "treemap"}
					<Label
						outerDivStyle="width: 150px; margin-left:{$hideClassFilter
							? 0
							: 25}px;"
						label="Image Size"
					>
						<Slider
							width={150}
							height={40}
							bind:value={imageSize}
							min={15}
							max={50}
							step={1}
							valueFormatCallback={(value) => `${value}px`}
							defaultTextColor={"lightgrey"}
							inputTextColor={"hsl(0, 0%, 12%)"}
						/>
					</Label>
					<Label
						outerDivStyle="width: 150px; margin-left:25px;"
						label="Clusters Visible"
					>
						<Slider
							width={150}
							height={40}
							bind:value={numClusters}
							min={2}
							max={20}
							step={1}
							valueFormatCallback={(value) => `${value}`}
							defaultTextColor={"lightgrey"}
							inputTextColor={"hsl(0, 0%, 12%)"}
						/>
					</Label>
				{:else if selectedVisualization === "grid"}
					<Label
						outerDivStyle="width: 300px; margin-left:10px;"
						label="Grid Size"
					>
						<div style="display: flex;">
							<div>
								<Slider
									width={150}
									height={40}
									bind:value={zoomedOutDims}
									min={1}
									max={$maxGrids}
									step={1}
									valueFormatCallback={(value) =>
										`${value} by ${value}`}
									defaultTextColor={"lightgrey"}
									inputTextColor={"hsl(0, 0%, 12%)"}
								/>
							</div>
							<button
								style="margin-left: 20px;"
								on:click={() => {
									updateZoomDimensions(zoomedOutDims);
								}}>recompute grid</button
							>
						</div>
					</Label>
				{/if}
			</div>
			<div class="row">
				{#if !$hideMisclassifiedImages && $hasPredictedClass}
					<Label outerDivStyle="width: 200px;" label="Outline Images">
						<div style="display: flex; align-items:center">
							<Switch
								switchSize={30}
								onColor={"hsl(0, 0%, 12%)"}
								bind:on={$showMisclassifications}
							/>
							<div
								style="margin-top: -4px; margin-left:5px; color: {$showMisclassifications
									? 'hsl(0, 0%, 12%)'
									: 'lightgrey'}"
							>
								Outline Misclassified
							</div>
						</div>
					</Label>
					<Label
						outerDivStyle="width: 200px; margin-left: 25px; opacity: {$showMisclassifications
							? 1
							: 1}"
						label="Focus Images"
					>
						<div style="display: flex; align-items:center;">
							<Switch
								switchSize={30}
								onColor={"hsl(0, 0%, 12%)"}
								bind:on={$highlightIncorrectImages}
							/>
							<div
								style="margin-top: -4px; margin-left:5px; color: {$highlightIncorrectImages
									? 'hsl(0, 0%, 12%)'
									: 'lightgrey'};"
							>
								Focus Misclassified
							</div>
						</div>
					</Label>
				{/if}
				{#if !$hideSimilarMode && $hasSimilar}
					<Label outerDivStyle="width: 250px;" label="Similar Images">
						<div style="display: flex; align-items:center">
							<Switch
								switchSize={30}
								onColor={"hsl(0, 0%, 12%)"}
								bind:on={$highlightSimilarImages}
							/>
							<div
								style="margin-top: -4px; margin-left:5px; color: {$highlightSimilarImages
									? 'hsl(0, 0%, 12%)'
									: 'lightgrey'}"
							>
								Highlight Similar By Hovering
							</div>
						</div>
					</Label>
				{/if}
			</div>
		</BigLabel>
	</div>
	{#if !$hideClassTable && $hasClasses}
		<div class="hor-line" />
		<div class="sidebar-item">
			<div class="parent-info">
				<BigLabel label="Class Table" textStyle="margin-bottom: -2px;">
					<div>
						{#if $selectedParent !== null && !changedDataset}
							<ClassTable
								nodes={$selectedParent.cluster}
								classes={copyClasses()}
								{clickClassName}
								tweenRows={animateClassTable}
							/>
						{/if}
					</div>
				</BigLabel>
			</div>
		</div>
	{/if}

	<div class="hor-line" />
	<div class="sidebar-item">
		<BigLabel label="Image Details" textStyle="margin-bottom: -2px;">
			<div class="image-info">
				<SimilarImages image={$selectedImage} showSimilarImages />
			</div>
		</BigLabel>
	</div>
</div>

<style>
	:root {
		--lighter-grey: hsla(0, 0%, 0%, 0.1);
	}
	.hor-line {
		background-color: var(--lighter-grey);
		width: 100%;
		height: 1px;
	}
	.spacer {
		margin-top: 10px;
		margin-bottom: 10px;
	}
	#classList li {
		cursor: pointer;
	}
	#sidebar {
		border-right: 1.5px solid var(--lighter-grey);
		background-color: hsl(0, 0%, 98.5%);
		height: 100%;
	}
	.sidebar-item {
		padding-left: 20px;
		padding-right: 20px;
		padding-top: 10px;
		padding-bottom: 10px;
	}
	#name {
		font-size: 25px;
		font-weight: 600;
	}
	.row {
		display: flex;
		margin-top: 5px;
		flex-wrap: wrap;
	}
	.disabled {
		color: lightgrey;
	}
	.on {
		color: #0275ff;
	}
	select {
		border: none;
		border-left: 2px solid var(--dark-grey);
		font: inherit;
		cursor: pointer;
	}
	select:focus {
		border: none;
		outline: none;
		border-left: 2px solid var(--clear-grey);
	}
	.help-button {
		background-color: transparent;
		cursor: pointer;
		border-width: 1px;
		border-radius: 3px;
		border-color: rgba(255, 166, 0, 0.431);
		font-size: 16px;
	}
</style>
