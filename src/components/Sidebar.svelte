<script>
	import { createEventDispatcher } from "svelte";
	import {
		selectedParent,
		selectedImage,
		showMisclassifications,
		treemapImageSize,
		treemapNumClusters,
		highlightSimilarImages,
		currentClassFilter,
		highlightIncorrectImages,
		hasClasses,
		hasSimilar,
		hasPredictedClass,
		imagesToHighlight,
	} from "../stores/sidebarStore";
	import Label from "./sidebarComponents/Label.svelte";
	import ClassTable from "./classTable/ClassTable.svelte";
	import SimilarImages from "./SimilarImages.svelte";
	import SearchableSelect from "./SearchableSelect.svelte";
	import BigLabel from "./sidebarComponents/BigLabel.svelte";
	import Switch from "./sidebarComponents/Switch.svelte";
	import Slider from "./sidebarComponents/Slider.svelte";
	import Name from "./article/Name.svelte";

	const dispatch = createEventDispatcher();

	export let classes; // array of strings containing the class names
	export let animateClassTable = false;
	export let articleSidebarOpen = false;
	export let options; // options that show the dataset and endpoints
	export let selectedOption; // current select option index
	export let changedDataset = false; // some bs to get things to work

	let numClusters = 8; // starting num clusters
	let imageSize = $treemapImageSize > 0 ? $treemapImageSize : 35;

	const copyClasses = () =>
		classes ? classes.map((className) => className) : [];

	function clickClassName(className) {
		dispatch("clickClassName", {
			className: className,
		});
	}
	async function updateSetting(imageSize, numClusters) {
		await treemapImageSize.set(imageSize);
		await treemapNumClusters.set(numClusters);
	}

	$: cpyClasses = classes ? classes.map((className) => className) : [];
	$: {
		updateSetting(imageSize, numClusters);
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
				<span class="medium">Click to Open</span>: What is <Name />?
			</button>
		</div>
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
					<option value={i}>{option.dataset} {option.model}</option>
				{/each}
			</select>
		</Label>
	</div>
	<div class="hor-line" />

	<div class="sidebar-item" id="visualization-settings">
		<BigLabel label="Settings">
			<div class="row">
				{#if $hasClasses}
					<Label outerDivStyle="width: 120px;" label="Class Filter">
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
				<Label
					outerDivStyle="width: 150px; margin-left:{!$hasClasses
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
			</div>
			<div class="row">
				{#if $hasPredictedClass}
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
				{#if $hasSimilar}
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
	{#if $hasClasses}
		<div class="hor-line" />
		<div class="sidebar-item">
			<div class="parent-info">
				<BigLabel label="Class Table" textStyle="margin-bottom: -2px;">
					<div>
						{#if $selectedParent !== null && !changedDataset}
							<ClassTable
								nodes={$selectedParent.cluster}
								classes={copyClasses()}
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
	.row {
		display: flex;
		margin-top: 5px;
		flex-wrap: wrap;
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
		border: 1px solid rgba(0, 0, 0, 0.1);
		box-shadow: 0px 0px 2px 1px rgba(0, 0, 0, 0.05);
		font-size: 16px;
	}
	.help-button:hover {
		box-shadow: 0px 0px 2px 1px rgba(0, 0, 0, 0.1);
	}
	span.medium {
		font-weight: 600;
	}
</style>
