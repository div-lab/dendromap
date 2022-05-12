<script>
	import { fly } from "svelte/transition";
	import Article from "./Article.svelte";
	import ExitButton from "./ExitButton.svelte";
	export let width = "750px";

	export let open = false;

	let scrollTop = 0;

	/** @type {HTMLElement} */
	let contentEl;

	$: {
		if (open && contentEl) {
			contentEl.scrollTo({ top: scrollTop });
		}
	}
	const exit = () => {
		open = false;
		scrollTop = contentEl.scrollTop;
	};
</script>

{#if open}
	<div id="article-sidebar" style="" on:click={exit} transition:fly>
		<div
			bind:this={contentEl}
			id="content"
			style="width: {width};"
			on:click|stopPropagation={() => {
				console.log("inside");
			}}
			transition:fly={{ x: -900 }}
		>
			<ExitButton on:click={exit} />
			<Article />
		</div>
	</div>
{/if}

<style>
	#article-sidebar {
		height: 100%;
		width: 100%;
		left: 0;
		top: 0;
		position: absolute;
		background-color: #00000040;
	}
	#content {
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		background-color: white;
		overflow-y: overlay;
		overflow-x: hidden;
		box-shadow: 3px 3px 20px 5px #00000076;
	}
</style>
