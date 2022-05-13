# DendroMap

[DendroMap](https://div-lab.github.io/dendromap/) is an interactive tool to explore large-scale image datasets used for machine learning.

A deep understanding of your data can be vital to train or debug your model effectively. However, due to the lack of structure and little-to-no metadata, it can be difficult to gain any insight into large-scale image datasets.

DendroMap adds structure to the data by hierarchically clustering together similar images. Then, the clusters are displayed in a modified treemap visualization that supports zooming.

<a href="https://div-lab.github.io/dendromap/" target="_blank">
	<img src="dendromap-demo.gif" />
</a>

Check out the [live demo of DendroMap](https://div-lab.github.io/dendromap/) and explore for yourself on a few different datasets.

Describe how to use your own data

Paper link here.

## Run Locally

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
