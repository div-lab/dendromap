<script>
	import Select from "svelte-select"; //https://svelte.dev/repl/a859c2ba7d1744af9c95037c48989193?version=3.12.1
	import { createEventDispatcher } from "svelte";
	import { select } from "d3";

	const dispatch = createEventDispatcher(); // to pass up the events

	export let style = `width: 300px`;
	export let placeholder = "Select...";
	export let onlyValuesNoLabels = false;
	export let isClearable = true;
	export let items = [
		{ value: "chocolate", label: "Chocolate" },
		{ value: "pizza", label: "Pizza" },
		{ value: "cake", label: "Cake" },
		{ value: "chips", label: "Chips" },
		{ value: "ice-cream", label: "Ice Cream" },
	];
	export let initialValue;
	export let value = initialValue;

	function handleSelect(event) {
		dispatch("select", event.detail);
	}
	function handleClear(event) {
		dispatch("clear", "cleared");
	}

	// in the case the items is just = ["chocolate", ..., "ice-cream"]
	let selectData = [];
	$: {
		if (onlyValuesNoLabels) {
			selectData.map((value) => ({ value, label: value }));
		}
	}
</script>

<div class="select-container themed" {style}>
	<Select
		on:select={handleSelect}
		on:clear={handleClear}
		{isClearable}
		{placeholder}
		{items}
		bind:value
		showChevron
	/>
</div>

<style>
	.select-container {
		/* width: 300px; */
	}
	.themed {
		--height: 30px;
		--borderFocusColor: hsl(0, 0%, 12%);
		--indicatorTop: 4px;
		--itemHoverBG: hsla(0, 0%, 12%, 0.1);
		--itemIsActiveBG: hsl(0, 0%, 12%);

		--clearSelectBottom: 0;
		--clearSelectTop: 4px;
	}
</style>
