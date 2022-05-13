# DendroMap Data Generation with Clustering

## Generating Data Files

Before using the `dendromap_data.py` make sure you have [SciPy](https://scipy.org/) and [NumPy](https://numpy.org/) installed.

### Clustering + Dendrogram Export

After running your model and extracting the high-dimensional representation of each image, make sure you have an array of dictionaries that look like this

```python
instances = [{"filename":"image0.png", "index": 0}, ..., {"filename":"image999.png", "index":999}]
```

The filename needs to be unique and the instance index needs to be unique. The filename does not need to have the instance index nor does it need to be a png, it was just an example.

```python
from dendromap_data import compute_dendrogram

instances = [{"filename":"image0.png", "index": 0}, ..., {"filename":"image999.png", "index":999}]
dendrogram = compute_dendrogram(instances) # thats it!
```

Now you can export the dendrogram like this

```python
import json

dendrogram = compute_dendrogram(instances)
with open("filename.json", "w") as out_file:
	dendrogram_json = dendrogram.to_json()
	json.dump({"tree": dendrogram_json}, out_file)
```

Now you can use it in [DendroMap Code](https://github.com/div-lab/dendromap) by adding it as an option in the `src/dataOptions.js` file. More info in the [DendroMap Data](https://github.com/div-lab/dendromap-data) repo.

### More Complicated Example

To add prediction and class information, and maybe even dedicated filtering for each class, you still use the `compute_dendrogram`. Go through the `resnet50_cifar10.ipynb` notebook to see how that information can be computed and attached to the dendrogram object for use in the [DendroMap Code](https://github.com/div-lab/dendromap).

There are three examples

-   resnet50 and cifar10 test data (10k instances)
-   resnet50 and cifar100 test data (10k instances)
-   (Experimental) Variational Autoencoder and MNIST train data (60k instances)

The notebooks are provided that generated the code in the [DendroMap Live Site](https://div-lab.github.io/dendromap/) and exported to [DendroMap Data](https://github.com/div-lab/dendromap-data).
