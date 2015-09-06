function draw(img, width, height) {
    var _self = this;
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    context.shadowBlur = 20;
    context.shadowColor = "#DDDDDD";
    context.drawImage(img, 0, 0, width, height);
    var imageData = context.getImageData(0, 0, 1080, 600);
    var pixel = imageData.data;
    for (var i = 0, length = pixel.length; i < length; i += 4) {
        //pixel[i + 2] = pixel[i + 1] = pixel[i] = (pixel[i] * 19595 + pixel[i + 1] * 38469 + pixel[i + 2] * 7472) >> 16;
    }

    canvas = $("#canvas");
    canvas.click(function(e) {
        var canvasOffset = canvas.offset();
        var canvasX = Math.floor(e.pageX - canvasOffset.left);
        var canvasY = Math.floor(e.pageY - canvasOffset.top);
        // 获取该点像素的数据
        var imageData = context.getImageData(canvasX, canvasY, 1, 1);
        // 获取该点像素数据
        var pixel = imageData.data;

        var pixelColor = "rgba(" + pixel[0] + "," + pixel[1] + "," + pixel[2] + "," + pixel[3] + ")";
        $("body").css("backgroundColor", pixelColor);
        console.log("当前背景颜色为:" + matrix[canvasX][canvasY].R + ',' + matrix[canvasX][canvasY].G + ',' + matrix[canvasX][canvasY].B);
    });
}
$(document).ready(function() {
    var img = new Image();
    img.src = "/Simage/img/pic.jpg";
    $(img).load(function() {
        draw(img, 1080, 600);
    });




    $('.change').click(function() {
        var context = $('#canvas')[0].getContext('2d');
        var imageData = context.getImageData(0, 0, 1080, 900);
        Simage.blackAndWhite(imageData);
        context.putImageData(imageData, 0, 0);
    });

    $('.gaosi').click(function() {
        var context = $('#canvas')[0].getContext('2d');
        var imageData = context.getImageData(0, 0, 1080, 900);
        Simage.gaussianBlur(imageData, 1080);
        context.putImageData(imageData, 0, 0);
    });

    $('.edge').click(function() {
        var context = $('#canvas')[0].getContext('2d');
        var imageData = context.getImageData(0, 0, 1080, 900);
        Simage.edge(imageData, 1080);
        context.putImageData(imageData, 0, 0);
    })
    $('.flip').click(function() {
        var context = $('#canvas')[0].getContext('2d');
        var imageData = context.getImageData(0, 0, 1080, 900);
        Simage.colorFlip(imageData);
        context.putImageData(imageData, 0, 0);
    })
    $('.sharpen').click(function() {
        var context = $('#canvas')[0].getContext('2d');
        var imageData = context.getImageData(0, 0, 1080, 900);
        Simage.sharpen(imageData, 1080);
        context.putImageData(imageData, 0, 0);
    })
    $('.histogramBlance').click(function() {
        var context = $('#canvas')[0].getContext('2d');
        var imageData = context.getImageData(0, 0, 1080, 900);
        Simage.histogramBlanceWithColor(imageData);
        context.putImageData(imageData, 0, 0);
    })
    $('.medianFilter').click(function() {
        var context = $('#canvas')[0].getContext('2d');
        var imageData = context.getImageData(0, 0, 1080, 900);
        Simage.medianFilter(imageData, 1080);
        context.putImageData(imageData, 0, 0);
    })
    $('.download').click(function() {
        var href = $('#canvas')[0].toDataURL('image/png').replace("image/png", "image/octet-stream");
        window.location.href = href;
    })
});
