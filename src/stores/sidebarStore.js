import { writable } from "svelte/store";

// shared
export const selectedParent = writable(null);
export const showMisclassifications = writable(false);
export const selectedImage = writable(null);
export const highlightSimilarImages = writable(false);
export const currentClassFilter = writable(null);

// treemap
export const nodeHovering = writable(null);
export const treemapImageSize = writable(30);
export const treemapNumClusters = writable(0);
export const changingSizes = writable(false);

// baseline
export const showAsGrid = writable(true);
export const zoomedOutGridDimensions = writable(35);
export const zoomedInGridDimensions = writable(30);

export function updateZoomDimensions(zoomedOutDims, offsetRatio = 0.3) {
	zoomedOutGridDimensions.set(zoomedOutDims);
	zoomedInGridDimensions.set(Math.round(zoomedOutDims * (1 - offsetRatio)));
}

export const zoomedInSample = writable(undefined);
export const currentNodesShowing = writable([]);
export const maxGrids = writable(100);
export const isZoomedIn = writable(false);

// user study global variables
export const hideClassTable = writable(false);
export const hideSummaryClassTable = writable(false);
export const hideLabelCoverage = writable(true);
export const hideLabelAccuracy = writable(false);
export const highlightIncorrectImages = writable(false);
export const hideSimilarMode = writable(false);
export const hideClassFilter = writable(false);
export const hideMisclassifiedImages = writable(false);
export const hidePredictions = writable(false);
export const totalHeight = writable(950);

export const hideGlobalDetails = writable(false);
export const showUserStudyParameters = writable(false);
