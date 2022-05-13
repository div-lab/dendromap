<script>
	import { onMount } from "svelte";
	import Bar from "./Bar.svelte";
	import Label from "../sidebarComponents/Label.svelte";
	import Rate from "./Rate.svelte";
	import Switch from "../sidebarComponents/Switch.svelte";
	import { imagesToHighlight } from "../../stores/sidebarStore";

	export let classes = [];
	export let nodes = [];

	let localAccuracy = 0.0;
	let globalCoverage = 0.0;
	let localCount = 0;
	let globalCount = 0;

	function handleDivideByZero(num) {
		if (isNaN(num)) {
			return 0;
		} else {
			return num;
		}
	}

	/**
	 *
	 * @template T
	 * @param {string[]} classes
	 * @param {() => T} templateCallback
	 */
	function initClassCountsMap(classes, templateCallback) {
		const classesMap = new Map(
			classes.map((className, i) => [
				className,
				templateCallback(className, i),
			])
		);
		return classesMap;
	}
	/**
	 * Counts three fourths of a binary confusion matrix leaving out the TN
	 * @param {any[]} cluster
	 * @param {string[]} classes
	 */
	function FN_TP_FP_Count(cluster, classes) {
		let classesMap = initClassCountsMap(classes, () => ({
			classNameWasTheTrueAndPredClass: [],
			classNameWasTheTrueClassAndWrong: [],
			classNameWasThePredClassAndWrong: [],
			getTotalCountTrueClass: function () {
				return (
					this.classNameWasTheTrueAndPredClass.length +
					this.classNameWasTheTrueClassAndWrong.length
				);
			},
			getTotalCountPredClass: function () {
				return (
					this.classNameWasTheTrueAndPredClass.length +
					this.classNameWasThePredClassAndWrong.length
				);
			},
			getAccuracy: function () {
				const trueClassRight =
					this.classNameWasTheTrueAndPredClass.length;
				const output = trueClassRight / this.getTotalCountTrueClass();
				return handleDivideByZero(output);
			},
			getTrueClassWrongRate: function () {
				const trueClassWrong =
					this.classNameWasTheTrueClassAndWrong.length;
				const output = trueClassWrong / this.getTotalCountTrueClass();
				return handleDivideByZero(output);
			},
			getPredClassWrongRate: function () {
				const predClassWrong =
					this.classNameWasThePredClassAndWrong.length;

				const output = predClassWrong / this.getTotalCountPredClass();
				return handleDivideByZero(output);
			},
		}));

		cluster.forEach((instance) => {
			const { correct, predicted_class, true_class } = instance;

			let trueClassCounts = classesMap.get(true_class);
			let predictedClassCounts = classesMap.get(predicted_class);
			if (predictedClassCounts === undefined) {
				console.log(classesMap);
				console.log(predictedClassCounts);
				console.log(predicted_class);
				console.log(instance);
				throw Error();
			}

			if (correct) {
				trueClassCounts.classNameWasTheTrueAndPredClass.push(instance);
			} else if (!correct) {
				predictedClassCounts.classNameWasThePredClassAndWrong.push(
					instance
				);
				trueClassCounts.classNameWasTheTrueClassAndWrong.push(instance);
			} else {
				throw Error("make sure correct is a boolean");
			}
		});

		return classesMap;
	}

	let isDescendingSortOrder = true;
	function getTableDescending(callback, descending = isDescendingSortOrder) {
		const ascending = !descending;
		if (descending) {
			return (classA, classB) =>
				callback(tableData.get(classB)) -
				callback(tableData.get(classA));
		} else if (ascending) {
			return (classB, classA) =>
				callback(tableData.get(classB)) -
				callback(tableData.get(classA));
		}
	}
	const tableLegend = [
		{
			name: "Class Name",
			class: "class-name-dims",
			sort: (classA, classB) => classB.localeCompare(classA),
		},
		{
			name: "Count\n(Actual)",
			class: "bar-count",
			sort: getTableDescending((d) => d.getTotalCountTrueClass()),
		},
		{
			name: "Count\n(Predicted)",
			class: "bar-count",
			sort: getTableDescending((d) => d.getTotalCountPredClass()),
		},
		{
			name: "Accuracy",
			class: "rate-entry",
			sort: getTableDescending((d) => d.getAccuracy()),
		},
		{
			name: "False Negative Rate",
			class: "rate-entry",
			sort: getTableDescending((d) => d.getTrueClassWrongRate()),
		},
		{
			name: "False Positive Rate",
			class: "rate-entry",
			sort: getTableDescending((d) => d.getPredClassWrongRate()),
		},
	];
	let selectedSort = 1;

	function sortClasses(classes, selectedSort, isAscendingOrder) {
		sortedClasses = classes.sort(tableLegend[selectedSort].sort);
		if (isAscendingOrder) {
			sortedClasses = sortedClasses.reverse();
		}
		return sortedClasses;
	}
	onMount(() => {
		globalCount = nodes.length; // at the beginning the total count
	});

	$: sortedClasses = classes;
	$: {
		if (tableData && nodes) {
			sortedClasses = sortClasses(
				sortedClasses,
				selectedSort,
				!isDescendingSortOrder
			);
		}
	}

	function maxCount(classes, tableData) {
		let max = -Infinity;
		classes.forEach((className) => {
			const countsObj = tableData.get(className);
			const value = Math.max(
				countsObj.getTotalCountPredClass(),
				countsObj.getTotalCountTrueClass()
			);
			if (value > max) max = value;
		});
		return max;
	}
	$: {
		localCount = nodes.length;
		if (tableData) {
			localCount = maxCount(sortedClasses, tableData);
		}
	} // update after each one count

	function filterClassesGivenInputString(string, _classes = classes) {
		/** @type {string}*/
		const stringLower = string.toLowerCase();
		const filteredArray = _classes.filter((_class) =>
			_class.includes(stringLower)
		);
		return filteredArray;
	}
	let search = "";
	$: tableData = FN_TP_FP_Count(nodes, classes);
	$: {
		if (search.length > 0) {
			sortedClasses = filterClassesGivenInputString(search);
		} else {
			sortedClasses = classes; // svelte thing to reset it
		}
	}

	$: {
		if (tableData) {
			if (globalCount > 0) {
				globalCoverage = computeCoverage(
					sortedClasses,
					tableData,
					globalCount
				);
			}
			if (localCount > 0) {
				localAccuracy = computeTotalAcc(
					sortedClasses,
					tableData,
					localCount
				);
			}
		}
	}
	/**
	 * Computes the coverage from the already computed class table
	 * @template T
	 * @param {Map} tableData
	 * @param {number} totalCount
	 */
	function computeCoverage(classes, tableData, totalCount) {
		const numWrong = classes.reduce((acc, className) => {
			const countsObj = tableData.get(className);
			return acc + countsObj.classNameWasTheTrueClassAndWrong.length;
		}, 0);
		const globalCoverage = numWrong / totalCount;
		return globalCoverage;
	}

	/**
	 * Computes the total Accuracy
	 * @template T
	 * @param {Map} tableData
	 * @param {number} localCount
	 */
	function computeTotalAcc(classes, tableData, localCount) {
		const numRight = classes.reduce(
			(acc, className) => {
				const countsObj = tableData.get(className);
				let additions = {
					correct: countsObj.classNameWasTheTrueAndPredClass.length,
					total: countsObj.getTotalCountTrueClass(),
				};
				acc.correct += additions.correct;
				acc.total += additions.total;
				return acc;
			},
			{ correct: 0, total: 0 }
		);
		const localAcc = numRight.correct / numRight.total;
		return localAcc;
	}

	const orangeRed = "#DB4325";
	const blueGreen = "#006164";
	const barStyle = {
		color: "hsl(0, 0%, 12%, 0.4)",
		maxHeight: 15,
		textSpace: 30,
		maxWidth: 85,
		middleSpace: 5,
	};
</script>

<div id="table-settings">
	<Label label="Search Class" outerDivStyle="margin-right: 50px;">
		<input
			type="text"
			name="class-search"
			id="class-search"
			placeholder="Search..."
			bind:value={search}
		/>
	</Label>
	<Label label="Sorting Order">
		<div
			style="display: flex; width: 200px; align-items: center; justify-content: space-between;"
		>
			<div
				style="margin-top: -4px; margin-right:5px; color: {isDescendingSortOrder
					? 'steelblue'
					: 'lightgrey'}"
			>
				Descending
			</div>
			<Switch
				on:switch={() => {
					isDescendingSortOrder = !isDescendingSortOrder;
				}}
				onColor={"slateblue"}
				offColor={"steelblue"}
				switchSize={30}
			/>
			<div
				style="margin-top: -4px; margin-left:5px; color: {!isDescendingSortOrder
					? 'slateblue'
					: 'lightgrey'}"
			>
				Ascending
			</div>
		</div>
	</Label>
</div>
<div id="table-legend">
	{#if tableData}
		<table>
			<tr>
				{#each tableLegend as nameObj, index}
					<th
						style={index === selectedSort
							? `border-top: 4px solid ${
									isDescendingSortOrder
										? "steelblue"
										: "slateblue"
							  }`
							: ""}
						on:click={() => {
							selectedSort = index;
							console.log(tableLegend[selectedSort]);
						}}
						class={nameObj.class}
					>
						{#if nameObj.name.includes("\n")}
							<pre>{nameObj.name}</pre>
						{:else}
							{nameObj.name}
						{/if}
					</th>
				{/each}
			</tr>
		</table>
	{/if}
</div>
<div id="container">
	{#if tableData}
		<table>
			{#each sortedClasses as className}
				<tr>
					<td class="class-name">
						{className}
					</td>
					<td
						class="table-entry bar-count"
						on:mouseenter={() => {
							const classData = tableData.get(className);
							const allTrueLabels = [
								...classData.classNameWasTheTrueClassAndWrong,
								...classData.classNameWasTheTrueAndPredClass,
							];
							const instancesToHighlight = allTrueLabels.map(
								(node) => node.instance_index
							);

							imagesToHighlight.set(instancesToHighlight);
						}}
						on:mouseleave={() => {
							imagesToHighlight.set([]);
						}}
					>
						<Bar
							{...barStyle}
							maxVal={localCount}
							val={tableData
								.get(className)
								.getTotalCountTrueClass()}
							maxHeight={12}
						/>
					</td>
					<td
						class="table-entry bar-count"
						on:mouseenter={() => {
							const classData = tableData.get(className);
							const allPredLabels = [
								...classData.classNameWasThePredClassAndWrong,
								...classData.classNameWasTheTrueAndPredClass,
							];
							const instancesToHighlight = allPredLabels.map(
								(node) => node.instance_index
							);

							imagesToHighlight.set(instancesToHighlight);
						}}
						on:mouseleave={() => {
							imagesToHighlight.set([]);
						}}
					>
						<Bar
							{...barStyle}
							maxVal={localCount}
							val={tableData
								.get(className)
								.getTotalCountPredClass()}
							maxHeight={12}
						/>
					</td>
					<td
						class="table-entry total-class rate-entry"
						on:mouseenter={() => {
							const instancesToHighlight = tableData
								.get(className)
								.classNameWasTheTrueAndPredClass.map(
									(node) => node.instance_index
								);
							imagesToHighlight.set(instancesToHighlight);
						}}
						on:mouseleave={() => {
							imagesToHighlight.set([]);
						}}
					>
						<Rate
							maxColor={blueGreen}
							normalizedValue={tableData
								.get(className)
								.getAccuracy()}
						/>
					</td>
					<td
						class="table-entry total-incorrect rate-entry"
						on:mouseenter={() => {
							const instancesToHighlight = tableData
								.get(className)
								.classNameWasTheTrueClassAndWrong.map(
									(node) => node.instance_index
								);
							imagesToHighlight.set(instancesToHighlight);
						}}
						on:mouseleave={() => {
							imagesToHighlight.set([]);
						}}
					>
						<Rate
							maxColor={orangeRed}
							normalizedValue={tableData
								.get(className)
								.getTrueClassWrongRate()}
						/>
					</td>
					<td
						class="table-entry total-correct rate-entry"
						on:mouseenter={() => {
							const instancesToHighlight = tableData
								.get(className)
								.classNameWasThePredClassAndWrong.map(
									(node) => node.instance_index
								);
							imagesToHighlight.set(instancesToHighlight);
						}}
						on:mouseleave={() => {
							imagesToHighlight.set([]);
						}}
					>
						<Rate
							maxColor={orangeRed}
							normalizedValue={tableData
								.get(className)
								.getPredClassWrongRate()}
						/>
					</td>
				</tr>
			{/each}
		</table>
	{/if}
</div>

<style>
	:root {
		--table-border: 0.75px solid rgb(235, 235, 235);
	}
	/* width */
	::-webkit-scrollbar {
		width: 3px;
	}

	/* Track */
	::-webkit-scrollbar-track {
		background: #f1f1f1;
	}

	/* Handle */
	::-webkit-scrollbar-thumb {
		background: #888;
	}

	/* Handle on hover */
	::-webkit-scrollbar-thumb:hover {
		background: #555;
	}
	#container {
		overflow-y: overlay;
		overflow-x: hidden;
		height: 125px;
		font-size: 10px;
		border-bottom: var(--table-border);
	}
	.class-name {
		text-align: end;
		--class-name-width: 70px;
		min-width: var(--class-name-width);
		max-width: var(--class-name-width);
		width: var(--class-name-width);
	}
	.class-name-dims {
		--class-name-width: 70px;
		min-width: var(--class-name-width);
		max-width: var(--class-name-width);
		width: var(--class-name-width);
	}
	table {
		border-collapse: collapse;
		width: 100%;
		table-layout: fixed;
	}
	td,
	th {
		border: var(--table-border);
		padding: 5px;
	}
	th {
		text-align: center;
	}
	td {
		border-top: var(--table-border);
		border-bottom: var(--table-border);
		border-left: var(--table-border);
		border-right: var(--table-border);
	}
	.table-entry {
	}
	.table-entry:hover {
		background: var(--clear-grey);
	}
	.rate-entry {
		width: 60px;
	}
	.bar-count {
		width: 90px;
	}
	#table-legend {
		font-size: 10px;
	}
	#table-legend th {
		background-color: hsl(0, 0%, 12%, 0.8);
		color: white;
	}
	#total-info {
		display: flex;
		justify-content: space-between;
	}
	#total-info div {
		width: 100px;
	}
	.current-sort {
		border-top: 4px solid salmon;
	}
	#table-settings {
		display: flex;
		margin-top: 10px;
	}
	#class-search {
		width: 148px;
		height: 30px;
		background-image: url("search_black_24dp.svg");
		background-repeat: no-repeat;
		background-position: left center;
		padding-left: 25px;
		background-position: 5px;
		background-size: 17px;
		outline: 0;
		font-size: inherit;
		font-weight: inherit;
	}
	#class-search:focus {
		border-color: black;
	}
	pre {
		font: inherit;
		text-overflow: inherit;
	}
</style>
