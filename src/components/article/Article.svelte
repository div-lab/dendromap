<script>
	import DendroMap from "./DendroMap.svelte";
	import Section from "./Section.svelte";
	import Subsection from "./Subsection.svelte";
	import Body from "./Body.svelte";
	import Writing from "./Writing.svelte";
	import PaperIcon from "../misc/PaperIcon.svelte";
	import Link from "../misc/Link.svelte";
</script>

<Writing>
	<Section>How to use <DendroMap /></Section>
	<Body>
		<DendroMap /> visualizes large-scale image datasets used for machine learning.
		Insight into your data can be important to effectively and efficiently train
		your model; however, without structure, exploration becomes difficult for
		a large number of images.
		<DendroMap /> adds a hierarchical structure to the images by grouping similar
		images together. The structure is displayed as an overview with a treemap
		and can be interactively explored to reveal finer-grained groups of similar
		images. With our visualization, you'll be able to explore the images and
		gain insight into the different types, balance, and diversity of images.
	</Body>
	<Body>
		Check out our <Link href="https://arxiv.org" openNewTab
			>Research Paper <PaperIcon
				height={15}
				fill="hsla(206, 90%, 20%, 0.7)"
			/>
		</Link> on <DendroMap /> if you are interested in the exact details, use
		cases, or the user study that supports <DendroMap />'s effectiveness
		compared to another structured exploration technique, t-SNE grid.
	</Body>
	<Body>
		For details on how to use the core <DendroMap /> features, scroll down to
		one of the sections:
		<Link href="#exploration-article">Exploration</Link> or
		<Link href="#analysis-article">Analysis</Link>.
	</Body>
	<Subsection id="exploration-article">Exploration</Subsection>
	<Body>
		After hierarchically (agglomerative) clustering the images, the
		structure is displayed with a treemap. By default, to not overwhelm,
		only a few (8) clusters are shown. The images displayed on each of these
		clusters previews the remainder of the dendrogram. You can interact to
		traverse down the tree to explore more images under that hierarchy.
	</Body>
	<Body
		>Exploring the <DendroMap /> is simple using two main interactions: Zooming
		In and Out.</Body
	>
	<Body>
		<b>Clusters Showing</b>. By clicking on a colored rectangle that houses
		a group of images, you can zoom into that image group with a zooming
		animation. This will reveal the specified number of clusters with those
		images.
	</Body>
	<Body>
		<b>Zooming In</b>. By clicking on a colored rectangle that houses a
		group of images, you can zoom into that image group with a zooming
		animation. This will reveal the specified number of clusters with those
		images.
	</Body>
	<Body>
		<b>Zooming Out</b>. By clicking on the current parent cluster (the outer
		most rectangle), you can zoom back to where you were before. This
		corresponds to zooming out animation and going back to an overview.
	</Body>

	<Subsection id="analysis-article">Analysis</Subsection>
	<Body>
		<b>Label</b>. By clicking on an image, it will show up in the Image
		Details section in the sidebar. Here you can get a larger view and see
		similar images computed with their high dimensional representation.
	</Body>
	<Body>
		<b>Class Table</b>. By clicking on an image, it will show up in the
		Image Details section in the sidebar. Here you can get a larger view and
		see similar images computed with their high dimensional representation.
	</Body>
	<Body>
		<b>Image Click</b>. By clicking on an image, it will show up in the
		Image Details section in the sidebar. Here you can get a larger view and
		see similar images computed with their high dimensional representation.
	</Body>
</Writing>

<style>
</style>
