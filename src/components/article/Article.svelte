<script>
	import DendroMap from "./DendroMap.svelte";
	import Section from "./Section.svelte";
	import Subsection from "./Subsection.svelte";
	import Body from "./Body.svelte";
	import Writing from "./Writing.svelte";
	import PaperIcon from "../misc/PaperIcon.svelte";
	import Link from "../misc/Link.svelte";
	import SectionPreview from "./SectionPreview.svelte";
	import PaperLink from "./PaperLink.svelte";
	import people from "./people";
	import { color } from "d3";

	class Color {
		constructor(_color) {
			this.color = color(_color);
		}
		/**
		 * returns the color as hsl with said opacity
		 * @param normalized
		 * @returns {string} hsl string
		 */
		opacity(normalized) {
			const cpy = this.color.opacity;
			this.color.opacity = normalized;
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
		bolded: 600,
		light: 300,
	};
</script>

<Writing>
	<Section>What is <DendroMap />?</Section>
	<Body>
		<DendroMap /> is an interactive tool to explore large image-scale datasets
		used for machine learning.
	</Body>
	<Body>
		A deep understanding of your data can be vital to train your model
		efficiently and effectively; however, due to the lack of metadata and
		large number of images, exploration is incomprehensible.
	</Body>
	<Body>
		<DendroMap /> adds the much needed structure by grouping together similar
		images. Then, an overview of the similar groups of images are displayed in
		a treemap. For scalable exploration, you can click on a cluster in the treemap
		to
		<i>zoom</i> and reveal more clusters of images within that group.
	</Body>
	<Body>
		If you're interested in learning more, <b>click</b> to scroll on one of the
		three sections below.</Body
	>
	<div style="display: flex; justify-content:space-between;">
		<SectionPreview
			backgroundColor={theme.blue.opacity(0.1)}
			color={theme.blue}
			href="#exploration-article"
		>
			<div style="font-size: 20px;">
				<span style="color: grey;">How to</span>
				<span style="color: {theme.blue}; font-weight: {theme.bolded};"
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
				<span
					style="color: {theme.orange}; font-weight: {theme.bolded};"
					>Customize</span
				>
				<span style="color: grey;">and</span>
				<span
					style="color: {theme.orange}; font-weight: {theme.bolded};"
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
				<span style="color: {theme.green}; font-weight: {theme.bolded};"
					>More Info</span
				>
				<span style="color: grey;"> in our Research Paper</span>
			</div>
		</SectionPreview>
	</div>
	<Body>
		<DendroMap /> was created by
		{#each people as person, i}
			<Link href={person.url} openNewTab>{person.name}</Link
			>{#if i < people.length - 2},{" "}{:else if i < people.length - 1},
				and{" "}{/if}
		{/each}
		at Oregon State University.
	</Body>

	<Subsection
		id="exploration-article"
		dividerProps={{ color: theme.blue, thickness: 1.0 }}
		style="font-weight: {theme.light};"
	>
		<span style="color: grey;">How to</span>
		<span style="color: {theme.blue}; font-weight: {theme.bolded};"
			>Explore</span
		>
		<span style="color: grey;"> <code>DendroMap</code> </span>
	</Subsection>

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
		style="font-weight: {theme.light};"
	>
		<span style="color: {theme.orange}; font-weight: {theme.bolded};"
			>Customize</span
		>
		<span style="color: grey;">and</span>
		<span style="color: {theme.orange}; font-weight: {theme.bolded};"
			>Analyze</span
		>
		<span style="color: grey;">detail</span>
	</Subsection>
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
		style="font-weight: {theme.light};"
	>
		<span style="color: {theme.green}; font-weight: {theme.bolded};"
			>More Info</span
		>
		<span style="color: grey;"> in our Research Paper</span>
	</Subsection>
	<Body>
		If you are interested in learning about
		<ul class="contributions">
			<li>
				the <DendroMap /> motivations
			</li>
			<li>
				how we created the <DendroMap /> visualization
			</li>
			<li>
				<DendroMap />'s effectiveness: user study on <DendroMap /> compared
				to t-SNE grid for exploration
			</li>
		</ul>
		and more, please check out our <Link href="https://arxiv.org" openNewTab
			>Research Paper <PaperIcon
				height={15}
				fill="hsla(206, 90%, 20%, 0.7)"
			/></Link
		>.
		<PaperLink />
	</Body>
</Writing>
<div class="bottom-space" />

<style>
	.contributions {
		margin-top: 0;
		margin-bottom: 0;
	}
	.bottom-space {
		height: 1px;
		margin-bottom: 100px;
	}
</style>
