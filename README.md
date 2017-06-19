<div align="center">
    <div><img src="documentation/logo.png" /></div>
    <br>
    <br>
</div>

- [Try it out][site]
- [Post][post]

*reflow* is a small experiment that looks resizing images by reflowing their pixels into the new image dimensions.


## About
We normally think of images as two dimensional, with each pixel identifiable by an x and y coordinate. Reflow explores what happens if we instead treat pixel data as one dimensional, and specially how this applies to image resizing.

![](documentation/start.png)

For the above image, let's say that the indices of each pixel in a one dimensional array are:

```
0 1 2
3 4 5
6 7 8
```

Now, what happens if we want to decrease the width of the above image to make it just 2 pixels wide instead of 3? Traditional image resizing methods would crop or adjust the pixels to fit within the new size. Reflow on the other hand preserves the original pixel data but reflows the one dimensional array into the new image dimensions. 

![](documentation/vertical.png)

Because we started with 9 pixels in the 3x3 image, the new 2 pixel wide output image must be 5 pixels high in order to have room for the 9 pixels plus one unused pixel at the end. Here are the indices of each pixel in the output image:

```
0 1
2 3
4 5
6 7
8 X
```

We can resize the image horizontally using the same technique:

![](documentation/horizontal.png)


```
0 1 2 3
4 5 6 7
8 X X X
```

### Using the Site
[The reflow site][site] allows you to upload any image for reflow either by drag and drop or by using the file selector. Images are only stored client side.

The sliders in the left panel control the dimensions of the output image. The dimensions are linked so that adjusting the width will also automatically adjust the height of the ouput image so that it can fit all of the original image's pixels.


## Building and Running
The website uses [Jekyll](http://jekyllrb.com/) and [Webpack](http://webpack.github.io/) for building:

```bash
$ git checkout gh-pages
$ npm install
```

Start Jekyll with:

```bash
$ jekyll serve -w
```

Start webpack with:

```bash
$ webpack --watch
```

Main TypeScript code is in `src` and output to `dist` folder.


[site]: https://mattbierner.github.io/reflow/

[post]: http://blog.mattbierner.com/reflow