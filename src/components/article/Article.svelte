<script>
	import DendroMap from "./DendroMap.svelte";
	import Section from "./Section.svelte";
	import Body from "./Body.svelte";
	import Writing from "./Writing.svelte";
	import PaperIcon from "../misc/PaperIcon.svelte";
	import Link from "../misc/Link.svelte";
</script>

<Writing>
	<Section>How to use <DendroMap /></Section>
	<Body>
		<DendroMap /> is a tool you can use to explore a large number of images from
		machine learning image datasets. Without insight into the data, you're training
		a machine learning model in the dark, with no sound, and no idea what the
		next best step will be. Image datasets can have a ton of images, making discovery
		of balance, diversity, and types of images very difficult – leaving you in
		the dark.
		<DendroMap /> adds light to the process with structured exploration to develop
		insights into large-scale image datasets. With <DendroMap /> can get an overview
		of the main types of image groups and click to
		<i>zoom</i> to reveal more detail within that group. The overview and
		<i>zooming</i>
		on-demand make exploration of large-scale datasets possible without overwhelming
		you!
	</Body>
	<Body>
		Check out our <Link href="https://arxiv.org" openNewTab
			>research paper <PaperIcon
				height={15}
				fill="hsla(206, 90%, 20%, 0.7)"
			/>
		</Link> on <DendroMap />, if you are interested in the exact details.
	</Body>
</Writing>

<style>
</style>
