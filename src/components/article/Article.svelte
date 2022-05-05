<script>
	import DendroMap from "./DendroMap.svelte";
	import Section from "./Section.svelte";
	import Subsection from "./Subsection.svelte";
	import Body from "./Body.svelte";
	import Writing from "./Writing.svelte";
	import PaperIcon from "../misc/PaperIcon.svelte";
	import Link from "../misc/Link.svelte";
	import SectionPreview from "./SectionPreview.svelte";
	import { color } from "d3";

	class Color {
		constructor(_color) {
			this.color = color(_color);
		}
		opacity(o) {
			const cpy = this.color.opacity;
			this.color.opacity = o;
			const hsl = this.color.formatHsl();
			this.color.opacity = cpy;
			return hsl;
		}
		toString() {
			return this.color.formatHsl();
		}
	}
	let theme = {
		orange: new Color("#F59C16"),
		blue: new Color("#06B5DC"),
		green: new Color("#8ADB8D"),
	};
</script>

<Writing>
	<Section>How to use <DendroMap /></Section>
	<Body>
		Insight into your data is important to efficiently and effectively train
		your model; however, understanding of the types, diversity, and number
		of images is extremely difficult without additional metadata.
		<DendroMap /> is a structured approach to explore a large number of images
		for machine learning datasets without metadata. It just uses the images!
	</Body>
	<Body>
		<b>Click</b> on one of the three sections below for more information on
		the <DendroMap /> system.</Body
	>
	<div style="display: flex; justify-content:space-between;">
		<SectionPreview
			backgroundColor={theme.blue.opacity(0.1)}
			color={theme.blue}
			href="#exploration-article"
		>
			<div style="font-size: 20px;">
				<span style="color: grey;">How to</span>
				<span style="color: {theme.blue}; font-weight: 700;"
					>Explore</span
				>
				<span style="color: grey;"> <code>DendroMap</code> </span>
			</div>
		</SectionPreview>
		<SectionPreview
			backgroundColor={theme.orange.opacity(0.1)}
			color={theme.orange}
			href="#analysis-article"
		>
			<div style="font-size: 20px;">
				<span style="color: {theme.orange}; font-weight: 700;"
					>Customize</span
				>
				<span style="color: grey;">and</span>
				<span style="color: {theme.orange}; font-weight: 700;"
					>Analyze</span
				>
				<span style="color: grey;">detail</span>
			</div>
		</SectionPreview>
		<SectionPreview
			backgroundColor={theme.green.opacity(0.1)}
			color={theme.green}
			href="#more-info-article"
		>
			<div style="font-size: 20px;">
				<span style="color: {theme.green}; font-weight: 700;"
					>More Info</span
				>
				<span style="color: grey;"> in the Research Paper</span>
			</div>
		</SectionPreview>
	</div>

	<Subsection
		id="exploration-article"
		dividerProps={{ color: theme.blue, thickness: 1.0 }}
		>How to Explore <code>DendroMap</code></Subsection
	>
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

	<Subsection
		id="analysis-article"
		dividerProps={{ color: theme.orange, thickness: 1.0 }}
		>Customize and Analyze Details</Subsection
	>
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

	<Subsection
		id="more-info-article"
		dividerProps={{ color: theme.green, thickness: 1.0 }}
		>More Info</Subsection
	>
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
</Writing>

<style>
</style>
