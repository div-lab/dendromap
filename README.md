# DendroMap User Interface

This repository contains the `DendroMap` implementation written in Javascript (Svelte and D3.js). This code was used in the [deployment to the web](https://anonymous-account-for-review.github.io/dendromap/).

*The code and deployment are both anonymized for blind review: no names of the members are displayed anywhere*


### Overview

![ezgif-1-e4086f606f](https://user-images.githubusercontent.com/81268289/160336156-4009c586-fb52-461a-849c-8cea6d043319.gif)

The `DendroMap` user interface is an exploration tool for large-scale image datasets used in machine learning. With the `DendroMap`, you can overview the main groups of images and interactively zoom to reveal subgroups that fall within the hierarchy. By treaversing further down the `DendroMap` the overview gets more detailed allowing for fine-grained exploration of images, even in large-scale datasets. 

For further customization and analysis during exploration, the sidebar on the left side includes rendering settings, a class table, and image details. 

You can use the settings to customize the overview level by changing the image size, to reveal more or less images, or change the number of image groups currently showing. You can also highlight the misclassified images to quickly explore clusters with large numbers of error. 

You can use the class table to analyze counts and error at a class level for the images at the current parent cluster. By hovering over an entry in the table, the images that go into computing the count or rate are highlted in the `DendroMap`. This class table can be used to quickly target groups of images and find them on the `DendroMap`. 

You can click on an image in the `DendroMap` to reveal details about the image in the sidebar. This section is used to get the file id, actual class, and predicted class of an image. It also contains a list of similar images which can be used to find similar or counterfactual exmaples.

*In this particular deployment, the image representations that were clustered came from a high-dimensional vector from a REsnet-50 model trained on cifar10 images.*

### Rum Locally

```bash
cd dendromap      # inside the dendromap directory
npm install       # install packages
npm run dev       # run the development server
```

then navigate to [http://localhost:8080/](http://localhost:8080/)

