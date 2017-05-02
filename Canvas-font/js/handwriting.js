var canvasWidth = Math.min(800, $(window).width() - 20);
var canvasHeight = canvasWidth;

var strokeColor = "black";
var isMouseDown = false;
var lastLoc = {
	x: 0,
	y: 0
};
var lastTimestamp = 0;
var lastLineWidth = -1;

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

$("#controller").css("width", canvasWidth + "px");

canvas.width = canvasWidth;
canvas.height = canvasHeight;

drawGrid();
$("#clear_btn").click(
	function(e) {
		context.clearRect(0, 0, canvasWidth, canvasHeight);
		drawGrid();
	}
)
$(".color_btn").click(
	function(e) {
		$(".color_btn").removeClass("color_btn_selected")
		$(this).addClass("color_btn_selected")
		strokeColor = $(this).css("background-color");
	}
)

function beginStroke(point) {
	isMouseDown = true;
	lastLoc = ({
		x: point.x,
		y: point.y
	});
	lastTimestamp = new Date().getTime();
}

function endStroke() {
	isMouseDown = false;
}

function moveStroke(point) {
	var curLoc = ({
		x: point.x,
		y: point.y
	});
	var curTimestamp = new Date().getTime();
	var s = calcDistance(curLoc, lastLoc); //两地间的距离
	var t = curTimestamp - lastTimestamp; //两点间的时间

	var line_Width = calcLineWidth(t, s);
	console.log("line_Width" + line_Width);
	//draw
	context.beginPath();
	context.moveTo(lastLoc.x, lastLoc.y);
	context.lineTo(curLoc.x, curLoc.y);
	context.lineWidth = line_Width;
	context.lineCap = "round"; //是线条平滑
	context.lineJoin = "round";
	context.strokeStyle = strokeColor;
	context.stroke();

	lastLoc = curLoc;
	lastTimestamp = curTimestamp;
	lastLineWidth = line_Width;
}
canvas.onmousedown = function(e) {
	e.preventDefault();
	beginStroke({
		x: e.offsetX,
		y: e.offsetY
	}); //point是通过这个坐标获取到的点
}
canvas.onmouseup = function(e) {
	e.preventDefault();
	endStroke();
}
canvas.onmouseout = function(e) {
		e.preventDefault();
		endStroke();
	}
	/*写字的核心逻辑部分：在用户按住鼠标左键（isMouseDown为true）并在Canvas上移动鼠标的时候，onmousemove每隔一段时间执行一次，
	每次执行的时候，只要和用户上一次鼠标所在的位置的点之间画直线就可以了，由于用户在Canvas上绘制的时候，onmousemove这个函数执行的频率
	频率是非常多的，执行的时间点之间差距非常的小，所以虽然每一次绘制的是直线，总体绘制出来是相对平滑的，用户用肉眼看不出细小的区别*/
canvas.onmousemove = function(e) {
	e.preventDefault();
	if(isMouseDown) {
		//console.log("mouse move");
		moveStroke({
			x: e.offsetX,
			y: e.offsetY
		});
	}
}

//屏幕触控响应事件
canvas.addEventListener("touchstart", function(e) {
	e.preventDefault();
	//对于触控事件来说，可能存在多点触控的情况，那么多点触控的信息就被存在于touches的数组中，那么我们写一个字，
	//默认用户只是用一个手指进行操作，即使用户用多个手指，我们也只选取touches中第0个元素，作为我们真正去识别的触控
	touch = e.touches[0];
	beginStroke({
		x: touch.pageX,
		y: touch.pageY
	});

});
canvas.addEventListener("touchmove", function(e) {
	e.preventDefault();
	if(isMouseDown) {
		console.log("mouse move");
		touch = e.touches[0];
		moveStroke({
			x: touch.pageX,
			y: touch.pageY
		});
	}
	
});
canvas.addEventListener("touchend", function(e) {
	e.preventDefault();
	endStroke();
});

var maxLineWidth = 30;
var minLineWidth = 1;
var maxStrokeV = 10;
var minStrokeV = 0.1;

function calcLineWidth(s, t) {
	var v = s / t; //运笔速度
	var resultLineWidth;
	if(v <= minStrokeV) {
		resultLineWidth = maxLineWidth
	} else if(v >= maxStrokeV) {
		resultLineWidth = minLineWidth
	} else {
		resultLineWidth = maxLineWidth - (v - minStrokeV) / (maxStrokeV - minStrokeV) * (maxLineWidth - minLineWidth)
	}
	if(lastLineWidth == -1) {
		return resultLineWidth
	} else {
		return lastLineWidth * 2 / 3 + resultLineWidth * 1 / 3;
	}
}

function calcDistance(loc1, loc2) {
	return Math.sqrt((loc1.x - loc2.x) * (loc1.x - loc2.x) + (loc1.y - loc2.y) * (loc1.y - loc2.y));
}
//绘制边框
function drawGrid() {
	context.save();
	context.strokeStyle = "rgb(230,11,9)";

	context.beginPath();
	context.moveTo(3, 3);
	context.lineTo(canvasWidth - 3, 3);
	context.lineTo(canvasWidth - 3, canvasHeight - 3);
	context.lineTo(3, canvasHeight - 3);
	context.closePath();

	context.lineWidth = 6;
	context.stroke();

	context.beginPath();
	context.moveTo(0, 0);
	context.lineTo(canvasWidth, canvasHeight);

	context.moveTo(canvasWidth, 0);
	context.lineTo(0, canvasHeight);

	context.moveTo(canvasWidth / 2, 0);
	context.lineTo(canvasWidth / 2, canvasHeight);

	context.moveTo(0, canvasHeight / 2);
	context.lineTo(canvasWidth, canvasHeight / 2);

	context.lineWidth = 1;
	context.stroke();
	context.restore();
}