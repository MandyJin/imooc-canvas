var dom=document.getElementById('clock');
var ctx=dom.getContext("2d");
var width=ctx.canvas.width;
var height=ctx.canvas.height;
var r=width/2;
var rem= width/200;//放大缩小比例
function drawBackground(){
	ctx.save();
	ctx.translate(r,r);//原点在正方形中心
	ctx.beginPath();//起始路径
	ctx.lineWidth=10*rem;//定义线条的宽度
	ctx.arc(0,0,r-ctx.lineWidth/2,0,2*Math.PI,false);//画弧线
	ctx.stroke();
	var hourNumbers=[3,4,5,6,7,8,9,10,11,12,1,2];//从开始角数字开始定义
	hourNumbers.forEach(function(number,i){
		ctx.font=18*rem+"px Arial"
		ctx.textAlign="center";//文本左右对齐
		ctx.textBaseline="middle"//文本上下对齐
		var rad = 2*Math.PI/12*i;//每个数字对应的弧度，i是索引
		var x = Math.cos(rad)*(r-30*rem);//小时数半径小于外圆的半径
		var y = Math.sin(rad)*(r-30*rem);
		ctx.fillText(number,x,y);
	});
	//秒针跳动时对应的60个点
	for(var i=0;i<60;i++){
		var rad = 2*Math.PI/60*i;
		var x = Math.cos(rad)*(r-18*rem);
		var y = Math.sin(rad)*(r-18*rem);
		ctx.beginPath();//重置起始路径
		if (i%5===0) {
			ctx.fillStyle="#000";
			ctx.arc(x,y,2*rem,0,2*Math.PI,false);
			
		}else{
			ctx.fillStyle="#ccc";
			ctx.arc(x,y,2*rem,0,2*Math.PI,false);
		}
		ctx.fill();
		
	}
}
function drawHour(hour,minute){
	    ctx.save();//保存当前状态
		ctx.beginPath();
		var rad = 2*Math.PI/12 *hour;
		var mrad=2*Math.PI/12/60*minute;
		ctx.rotate(rad+mrad);
		ctx.lineWidth=6*rem;
		ctx.lineCap='round';//设置直线的结束端点样式:圆角
		ctx.moveTo(0,10);//移动画图原点
		ctx.lineTo(0,-r/2);
		ctx.stroke();
		ctx.restore();//还原画小时之前的状态
	}
function drawMinute(minute){
		ctx.save();
		ctx.beginPath();
		var rad = 2*Math.PI/60 *minute;
		ctx.rotate(rad);
		ctx.lineWidth=3*rem;
		ctx.lineCap='round';
		ctx.moveTo(0,10);//移动画图原点
		ctx.lineTo(0,-r+30*rem);
		ctx.stroke();
		ctx.restore();
	}
function drawSecond(second){
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle="red";
		var rad = 2*Math.PI/60 *second;
		ctx.rotate(rad);
		ctx.moveTo(-2*rem,20*rem);//移动画图原点
		ctx.lineTo(2*rem,20*rem);//底部变宽（线的宽度是X轴）
		ctx.lineTo(1,-r+18*rem);//顶端更细
		ctx.lineTo(-1,-r+18*rem);
		ctx.fill();
		ctx.restore();
	}
function drawDot(){
	ctx.beginPath();
	ctx.fillStyle="#fff"
	ctx.arc(0,0,3*rem,0,2*Math.PI,false);
	ctx.fill();
}

/*drawBackground();//执行方法
drawDot();*/
function draw() {
	//clearRect()方法清空给定矩形内的指定像素,矩形的起始原点是左上角（0,0），但圆心的起始原点是矩形中心点(r,r)，
	//所以用save()和restore()方法保存画图之前的状态和恢复画图之前的状态;
	ctx.clearRect(0,0,width,height);
	var now = new Date();
	var hour = now.getHours();
	var minutes = now.getMinutes();
	var seconds = now.getSeconds();
	drawBackground();//执行方法
	drawHour(hour,minutes);
	drawMinute(minutes);
	drawSecond(seconds);
	drawDot();
	ctx.restore();
	
}
setInterval(draw,1000);//每秒画一次