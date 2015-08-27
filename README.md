#Simage#
A lightweight image processing library for Javascript , based on Canvas.

轻量级的Javascript图像处理库，基于Canvas

[Demo][1]

-------

#Usage#
Import `Simage.js`

    <script type="text/javascript" src="Simage.js"></script>
    
Then you can use it to process data from canvas. 

For example:


    //get image data
    var context = $('#canvas')[0].getContext('2d');
    var imageData = context.getImageData(0, 0, 1080, 900);
    
    //blance image's histogram with color
    Simage.histogramBlanceWithColor(imageData, 1080);
    
    //put image data to the canvas
    context.putImageData(imageData, 0, 0);
    
    


----------
#API#

**`Simage.blackAndWhite(imageData)`**

Change image into black and white.

黑白化

----------
**`Simage.gaussianBlur(imageData, imageWith)`**

Process image with gassian blur.

高斯模糊


----------
**`Simage.edge(imageData, imageWith)`**

Get the edge of the image.

边缘化


----------
**`Simage.colorFlip(imageData)`**

Flip the color of the image.

颜色反转


----------
**`Simage.sharpen(imageData, imageWith)`**

Sharpen the image.

锐化


----------


**`Simage.medianFilter(imageData, imageWith)`**

Filter the image with median algorithm.

中值滤波


----------


**`Simage.histogramBlance(imageData)`**

Blance the histogram of image , more efficient than `.histogramBlanceWithColor()` **but only worked in black & white picture.**

黑白图片的直方图均衡化，比针对彩色图片的`.histogramBlanceWithColor()`更高效，但也只能用于黑白图片。


----------
**`Simage.histogramBlanceWithColor(imageData)`**

Blance the histogram of a image with color , also worked with black & white picture.

彩色图片的直方图均衡化，黑白图片也能用。


  [1]: http://starkwang.github.io/Simage/