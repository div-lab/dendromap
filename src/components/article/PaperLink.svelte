<script>
	import people from "./people";
	import Link from "../misc/Link.svelte";
</script>

<div id="paper-container">
	<div>
		<a
			href="https://arxiv.org"
			target="_blank"
			style="text-decoration: none;"
		>
			<img
				src="figures/Paper.png"
				alt="paper-thumbnail"
				id="paper-thumbnail"
				width={125}
			/>
		</a>
	</div>
	<div id="paper-text">
		<div id="paper-title">
			Visual Exploration of Large-Scale Image Datasets for Machine
			Learning with Treemaps
		</div>
		<div id="paper-authors">
			{#each people as person, i}
				<Link href={person.url} openNewTab style="border: none;"
					>{person.name}</Link
				>{#if i < people.length - 1},{" "}{/if}
			{/each}
		</div>
	</div>
</div>

<style>
	#paper-thumbnail {
		border: 1px solid lightgrey;
		transition: 100ms box-shadow ease-in-out;
	}
	#paper-thumbnail:hover {
		box-shadow: 0px 2px 3px 3px rgba(0, 0, 0, 0.1);
	}
	#paper-container {
		margin-top: 25px;
		display: flex;
		gap: 20px;
		/* border: 1px solid grey; */
	}
	#paper-title {
		font-weight: 600;
		font-size: 17px;
		line-height: 1.2;
	}
	#paper-authors {
		margin-top: 2px;
		font-size: 14px;
		line-height: 1.2;
	}
	#paper-text {
		margin-top: 35px;
	}
</style>
