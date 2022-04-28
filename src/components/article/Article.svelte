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
		<Link href="#cluster-subsection">Treemap Exploration</Link> or
		<Link href="#image-subsection">Image Interactions</Link>.
	</Body>
	<Subsection id="cluster-subsection">Treemap Exploration</Subsection>
	<Body>TEst TEst TEst TEst TEst TEst</Body>
	<Body>TEst TEst TEst TEst TEst TEst</Body>
	<Body>TEst TEst TEst TEst TEst TEst</Body>
	<Subsection id="image-subsection">Image Details</Subsection>
	<Body>TEst TEst TEst TEst TEst TEst</Body>
	<Body>TEst TEst TEst TEst TEst TEst</Body>
	<Body>TEst TEst TEst TEst TEst TEst</Body>
</Writing>

<style>
</style>
