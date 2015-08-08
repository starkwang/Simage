 function draw(img) {
   var _self = this;
   var canvas = document.getElementById("canvas");
   var context = canvas.getContext("2d");
   context.shadowBlur = 20;
   context.shadowColor = "#DDDDDD";
   context.drawImage(img, 0, 0);
   var imageData = context.getImageData(0, 0, 10, 1);
   var pixel = imageData.data;
   console.log(pixel);
   for (var i = 0, length = pixel.length; i < length; i += 4) {
     console.log(i + ":rgb(" + pixel[i] + "," + pixel[i + 1] + "," + pixel[i + 2] + ")");
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
     draw(img);
   });
 });
