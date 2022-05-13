# DendroMap

[DendroMap](https://div-lab.github.io/dendromap/) is an interactive tool to explore large-scale image datasets used for machine learning.

A deep understanding of your data can be vital to train or debug your model effectively. However, due to the lack of structure and little-to-no metadata, it can be difficult to gain any insight into large-scale image datasets.

DendroMap adds structure to the data by hierarchically clustering together similar images. Then, the clusters are displayed in a modified treemap visualization that supports zooming.

<a href="https://div-lab.github.io/dendromap/" target="_blank">
	<img src="https://user-images.githubusercontent.com/65095341/168213776-9181ab6e-b9b8-4557-9ead-b1abf7a50041.gif" />
</a>

Check out the [live demo of DendroMap](https://div-lab.github.io/dendromap/) and explore for yourself on a few different datasets.

## Use Your Own Data

In the [public deployment](https://div-lab.github.io/dendromap/), we hosted our data in the [DendroMap Data](https://github.com/div-lab/dendromap-data) repository. You can use your own data by following the instructions in the [DendroMap Data](https://github.com/div-lab/dendromap-data) `README.md`. It will lead you down the right path and to the code we used to generate the clustering with the correct format.

Once you have these files, you can add another option in the `src/dataOptions.js` file as an object to specify how to read your data with the correct format. This is also detailed in the [DendroMap Data](https://github.com/div-lab/dendromap-data) `README.md`, and is simple as adding an option like this

```javascript
{
	dataset: "YOUR DATASET NAME",
	model: "YOUR MODEL NAME",
	cluster_filepath: "CLUSTER_FILEPATH",
	class_cluster_filepath: "CLASS_CLUSTER_FILEPATH**OPTIONAL**",
	image_filepath: "IMAGE_FILEPATH",
}
```

in the `src/dataOptions.js` options array.

The python that generates the clustering files is housed in [DendroMap Notebooks](https://github.com/div-lab/dendromap-notebooks). These include the examples that generated the data in [DendroMap Data](https://github.com/div-lab/dendromap-data).

## DendroMap Component

## Run Locally!

This project uses [Svelte](https://svelte.dev/). You can run the code on your local machine by using one of the following: development or build.

### Development

```bash
cd dendromap      # inside the dendromap directory
npm install       # install packages if you haven't
npm run dev       # live-reloading server on port 8080
```

then navigate to [port 8080](http://localhost:8080/) for a live-reloading on file change development server.

### Build

```bash
cd dendromap		# inside the dendromap directory
npm install       	# install packages if you haven't
npm run build       # build project
npm run start		# run on port 8080
```

then navigate to [port 8080](http://localhost:8080/) for the static build server.

## Links

-   [DendroMap Live Site](https://div-lab.github.io/dendromap/)
-   [DendroMap Code](https://github.com/div-lab/dendromap) (**you are here**)
-   [DendroMap Data](https://github.com/div-lab/dendromap-data)
-   [DendroMap Notebooks](https://github.com/div-lab/dendromap-notebooks)
