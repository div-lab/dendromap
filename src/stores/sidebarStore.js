import { writable } from "svelte/store";

// shared
export const selectedParent = writable(null);
export const selectedImage = writable(null);
export const currentClassFilter = writable(null);

// treemap
export const nodeHovering = writable(null);
export const treemapImageSize = writable(30);
export const treemapNumClusters = writable(0);
export const changingSizes = writable(false);

// helpful global variables for different UI states
export const hasClasses = writable(false);
export const hasTrueClass = writable(false);
export const hasPredictedClass = writable(false);
export const hasSimilar = writable(false);
export const hasAccuracy = writable(false);
export const imagesToHighlight = writable([]);
export const highlightIncorrectImages = writable(false);
export const showMisclassifications = writable(false);
export const highlightSimilarImages = writable(false);
