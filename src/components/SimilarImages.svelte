<script>
	import {
		hidePredictions,
		showMisclassifications,
		hasPredictedClass,
		hasTrueClass,
		hasSimilar,
		imagesToHighlight,
	} from "../stores/sidebarStore";
	import {
		globalLeafNodesObject,
		incorrectColor,
	} from "../stores/globalDataStore";
	import { imagesEndpoint } from "../stores/endPoints";
	import Label from "./sidebarComponents/Label.svelte";
	import { highlightImages, resetOpacity } from "./treemap/highlightImages";
	import * as d3 from "d3";

	export let image;
	export let imageWidth = 50;
	export let imageHeight = 50;
	export let selectedImageHeight = 150;
	export let selectedImageWidth = 150;
	export let showSimilarImages = true;
	const labelWidth = 150;
	let imageHover = null;

	$: notHovering = imageHover === null;
	$: currImage = notHovering ? image : imageHover;

	function imageIsEmpty() {
		return image === null || image === undefined;
	}
	function handleNull(value, _default = "...") {
		return !imageIsEmpty() ? value : _default;
	}
</script>

<div id="overall-container">
	<div id="selected-image">
		<div id="big-image">
			<div class="image-desc">
				<div class="row">
					<Label
						label="Image ID"
						outerDivStyle="width: {labelWidth}px;"
					>
						{handleNull(currImage?.instance_index)}
					</Label>
					{#if $hasTrueClass}
						<Label
							label="True Class"
							outerDivStyle="width: {labelWidth}px; "
						>
							{handleNull(currImage?.true_class)}
						</Label>
					{/if}
				</div>
				{#if !$hidePredictions && $hasPredictedClass}
					<div class="row" style="justify-content: end;">
						<Label
							label="Predicted Class"
							outerDivStyle="width: {labelWidth}px; margin-left: 15px;"
						>
							{handleNull(currImage?.predicted_class)}
						</Label>
					</div>
				{/if}
			</div>
			<div
				id="current-image-selection"
				style="width:{selectedImageWidth}px; height: {selectedImageHeight}px; border: 1px {!imageIsEmpty() &&
				$showMisclassifications &&
				!currImage.correct
					? incorrectColor
					: 'lightgrey'} solid;"
			>
				{#if image}
					<img
						src="{$imagesEndpoint}/{currImage.filename}"
						width={selectedImageWidth}
						height={selectedImageHeight}
						alt="magnified"
					/>
				{/if}
			</div>
		</div>
	</div>

	{#if showSimilarImages && $hasSimilar}
		<Label label="Similar Images" outerDivStyle="margin-top: -10px;">
			<div id="big-image-info">
				<div id="container">
					{#if image}
						{#each image.similar as simInstanceId}
							<img
								src={!imageIsEmpty()
									? `${$imagesEndpoint}/${
											$globalLeafNodesObject.idMap.get(
												simInstanceId
											).filename
									  }`
									: ""}
								alt="similar"
								width={imageWidth}
								height={imageHeight}
								style="border: 2px {$showMisclassifications &&
								!$globalLeafNodesObject.idMap.get(simInstanceId)
									.correct
									? incorrectColor
									: 'transparent'} solid; margin-top: 1px; margin-left: 1px;"
								on:mouseenter={() => {
									imageHover =
										$globalLeafNodesObject.idMap.get(
											simInstanceId
										);
									imagesToHighlight.set([simInstanceId]);
								}}
								on:mouseleave={() => {
									imagesToHighlight.set([]);
									imageHover = null;
								}}
							/>
						{/each}
					{/if}
				</div>
			</div></Label
		>
	{/if}
</div>

<style>
	#overall-container {
		/* padding: 5px; */
	}
	#container {
		height: 75px;
		overflow-y: overlay;
		display: flex;
		flex-flow: row;
		flex-wrap: wrap;
		justify-content: start;
		border: 1px lightgrey solid;
	}
	#selected-image {
		display: flex;
	}
	#big-image {
		display: flex;
		align-items: center;
	}

	/* width */
	::-webkit-scrollbar {
		width: 5px;
	}

	/* Track */
	::-webkit-scrollbar-track {
		background: #f1f1f1;
	}

	/* Handle */
	::-webkit-scrollbar-thumb {
		background: #888;
	}

	/* Handle on hover */
	::-webkit-scrollbar-thumb:hover {
		background: #555;
	}
	.row {
		display: flex;
		margin-left: 20px;
		margin-bottom: 20px;
		text-overflow: ellipsis;
	}
	.row > * {
		/* margin-left: 20px; */
	}
	#current-image-selection {
		border: 1px solid lightgrey;
	}
	#image-desc {
	}
</style>
