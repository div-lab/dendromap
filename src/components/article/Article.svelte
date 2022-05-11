<script>
	import Name from "./Name.svelte";
	import Section from "./Section.svelte";
	import Subsection from "./Subsection.svelte";
	import Body from "./Body.svelte";
	import Writing from "./Writing.svelte";
	import PaperIcon from "../misc/PaperIcon.svelte";
	import Link from "../misc/Link.svelte";
	import SectionPreview from "./SectionPreview.svelte";
	import PaperLink from "./PaperLink.svelte";
	import people from "./people";
	import Figure from "./Figure.svelte";
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
	<Section>What is <Name />?</Section>
	<Body>
		<Name /> is an interactive tool to explore large-scale image datasets used
		for machine learning.
	</Body>
	<Body>
		A deep understanding of your data can be vital to train or debug your
		model effectively. However, due to the lack of metadata and large-scale
		of image datasets, it can be difficult to get any insight into your
		data.
	</Body>
	<Body>
		<Name /> adds structure to the data by grouping together similar images.
		Then, hierarchies of similar image groups are displayed in a modified treemap
		for you to explore. To reveal more images and clusters, click on a rectangle
		in the <Name /> to <i>zoom-in</i> to that group of images. To
		<i>zoom-out</i>, click on the outermost parent rectangle. Clicking on an
		image will reveal more information in the
		<span class="medium">Image Details</span>.
	</Body>
	<Body>
		If you're interested in learning more, <span class="medium">click</span>
		to scroll on one of the three sections below.</Body
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
					>Interactions</span
				>
				<span style="color: grey;">and</span>
				<span
					style="color: {theme.orange}; font-weight: {theme.bolded};"
					>Customization</span
				>
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
		<Name /> was created by
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
		<Name /> displays a preview of the data and provides exploration by clicking
		to zoom into any cluster you want! If you prefer the tree explanation, each
		image groups overviews that portion of the tree. By clicking into a group,
		you are traversing down the tree to finer-grained clusters under that hierarchy.
	</Body>

	<Body>
		<Figure center>
			<img src="figures/zoom-in.svg" alt="zoom-in" width="100%" />
		</Figure>
		<b>Zooming In</b>. By clicking on a colored rectangle that houses a
		group of images, you can zoom into that image group with a zooming
		animation. This will reveal the specified number of clusters with those
		images.
	</Body>
	<Body>
		<Figure center>
			<img src="figures/zoom-out.svg" alt="zoom-out" width="60%" />
		</Figure>
		<b>Zooming Out</b>. By clicking on the current parent cluster (the outer
		most rectangle), you can zoom back to where you were before. This
		corresponds to zooming out animation and going back to an overview.
	</Body>

	<Body>
		With these two interactions alone you can explore the data down to the
		instances themselves!
	</Body>

	<Subsection
		id="analysis-article"
		dividerProps={{ color: theme.orange, thickness: 1.0 }}
		style="font-weight: {theme.light};"
	>
		<span style="color: {theme.orange}; font-weight: {theme.bolded};"
			>Interactions</span
		>
		<span style="color: grey;">and</span>
		<span style="color: {theme.orange}; font-weight: {theme.bolded};"
			>Customization</span
		>
	</Subsection>

	<Body>
		This section contains additional information for how the core
		interactions work and how they can customize or add to the exploration
		and analysis of images. The features are listed out in paragraphs below.
	</Body>

	<Body>
		<Figure center>
			<img
				src="figures/clusters-visible.svg"
				alt="clusters-visible"
				width="100%"
			/>
		</Figure>
		<div style="margin-top: 20px;" />
		<b>Clusters Visible</b>. You can increase the number of image clusters
		you see by increasing this slider. More clusters showing will show more
		splits between images for a more detailed exploration at each level of
		the tree. Alternatively, having less clusters showing will create more
		of a high-level overview of the images.
	</Body>
	<Body style="margin-top: 10px;">
		<Figure center>
			<img
				src="figures/interaction-example1.svg"
				alt="clusters-visible"
				width="75%"
			/>
		</Figure>
		<b>Class Filter and Highlighting</b>. If classes are present, you can
		filter the <Name /> by typing out or selecting a class that you want to only
		see with the <span class="medium">Class Filter</span>. If class
		predictions are also available, you can toggle to highlight the
		misclassified images with the
		<span class="medium">Focus Misclassified</span>
		switch or toggle to highlight them with a red border using the
		<span class="medium">Highlight Misclassified</span> switch.
	</Body>
	<Body style="margin-top: 10px;">
		<Figure center>
			<img
				src="figures/class-table.svg"
				alt="class-table-details"
				width="75%"
			/>
		</Figure>
		<b>Class Table and Image Details</b>. When the actual class and
		predicted class are present, the <span class="medium">Class Table</span>
		shows up in the sidebar. This table shows the counts and important rates,
		like accuracy, for class-level error analysis. You can hover over an entry
		in the table to have the corresponding images that went into the calculation
		highlighted in the <Name />. For a closer look at an image, you can also
		click on the image itself to see it larger and view similar images
		computed from its high-dimensional representation inside the
		<span class="medium">Image Details</span>.
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
				the <Name /> motivations
			</li>
			<li>
				how we created the <Name /> visualization
			</li>
			<li>
				<Name />'s effectiveness: user study on <Name /> compared to t-SNE
				grid for exploration
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
	.medium {
		font-weight: 500;
	}
</style>
