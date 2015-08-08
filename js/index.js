 function draw(img, width, height) {
   var _self = this;
   var canvas = document.getElementById("canvas");
   var context = canvas.getContext("2d");
   context.shadowBlur = 20;
   context.shadowColor = "#DDDDDD";
   context.drawImage(img, 0, 0, width, height);
   var imageData = context.getImageData(0, 0, 1080, 900);
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
     $("#currentColor").html("当前背景颜色为:" + pixelColor);
   });
 }
 $(document).ready(function() {
   var img = new Image();
   img.src = "../img/pic.jpg";
   $(img).load(function() {
     draw(img, 1080, 900);
   });




   $('.change').click(function() {
     var context = $('#canvas')[0].getContext('2d');
     var imageData = context.getImageData(0, 0, 1080, 900);
     var pixel = imageData.data;
     for (var i = 0, length = pixel.length; i < length; i += 4) {
       pixel[i + 2] = pixel[i + 1] = pixel[i] = (pixel[i] * 2 + pixel[i + 1] * 5 + pixel[i + 2] * 1) >> 3;
     }
     imageData.data = pixel;
     context.putImageData(imageData, 0, 0);
   })
 });
