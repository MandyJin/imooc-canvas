var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
var canvas=document.getElementById("canvas");
var context = canvas.getContext("2d");

canvas.width=canvasWidth;
canvas.height= canvasHeight;

var image= new Image();
var radius=50;
//因为每次调用前会重新赋值，初始化的值可以随意
var clippingRegion={x:-1,y:-1,r:radius};
//屏幕自适应
var leftMargin = 0,topMargin=0;

image.src = "img/cat.jpg";
image.onload=function(e){
	$("#blur-div").css("width",canvasWidth+"px");
	$("#blur-div").css("height",canvasHeight+"px");
	
	$("#blur-image").css("width",image.width+"px");
	$("#blur-image").css("height",image.height+"px");
	//移动端屏幕自适应
	leftMargin = (image.width-canvas.width)/2;
	topMargin = (image.height-canvas.height)/2;
	
	$("#blur-image").css("top",String(-topMargin)+"px");
	$("#blur-image").css("left",String(-leftMargin)+"px");

	initCanvas();
	
}
function initCanvas(){
	var theleft = leftMargin<0?-leftMargin:0;
	var thetop = topMargin<0?-topMargin:0
	
	clippingRegion={x:Math.random()*(canvas.width-radius*2-theleft*2)+radius+theleft,
					y:Math.random()*(canvas.width-radius*2-thetop*2)+radius+thetop,r:radius};//show之后调用reset时，对这个变量进行归位
	draw(image,clippingRegion);
}
function setClippingRegion(){
	context.beginPath();
	context.arc(clippingRegion.x,clippingRegion.y,clippingRegion.r,0,Math.PI*2,false);
	context.clip();
}
function draw(image,clippingRegion){
	context.clearRect(0,0,canvas.width,canvas.height);
	context.save();
	setClippingRegion();
	context.drawImage(image,
		Math.max(leftMargin,0),Math.max(topMargin,0),
		Math.min(canvas.width,image.width),Math.min(canvas.height,image.height),
		leftMargin<0?-leftMargin:0,topMargin<0?-topMargin:0,
		Math.min(canvas.width,image.width),Math.min(canvas.height,image.height));
	context.restore();
}
function reset(){
	initCanvas();
}
function show() {
	/*clippingRegion.r=1000;//剪辑区域足够大，覆盖整个图片的面积
	draw(image,clippingRegion);*/
	
	var theAnimation=setInterval(function(){
		console.log("animation");
		clippingRegion.r+=20;
		
		if (clippingRegion.r>Math.sqrt(canvas.width*canvas.width+canvas.height*canvas.height)) {
			clearInterval(theAnimation);
		}
		draw(image,clippingRegion);
	},30);
}
//阻止滑动
canvas.addEventListener("touchstart",function(e) {
	e.preventDefault();
});