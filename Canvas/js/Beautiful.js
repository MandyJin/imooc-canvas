var balls=[];
const colors=["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","CC0000"];
/*倒计时*/
const endTime = new Date();
endTime.setTime(endTime.getTime()+60*60*1000);
var curShowTimeSeconds = 0;
window.onload=function(){
	
	WINDOW_WIDTH=document.body.clientWidth;
	WINDOW_HEIGHT=document.body.clientHeight;
	MARGIN_LEFT=Math.round(WINDOW_WIDTH/10);
	MARGIN_TOP = Math.round(WINDOW_HEIGHT/5);
	r=Math.round(WINDOW_WIDTH*4/5/108)-1;
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	
	canvas.width=WINDOW_WIDTH;
	canvas.height=WINDOW_HEIGHT;
	
	curShowTimeSeconds = getCurrentShowTimeSeconds();
	setInterval(function(){
			render(context);
			update();
	},50);
		
	
}
/*倒计时*/
function getCurrentShowTimeSeconds() {
	var curTime = new Date();
	var ret = endTime.getTime()-curTime.getTime();
	ret = Math.round(ret/1000);
	
	return ret>=0?ret:0;
	
	//时钟效果
	/*var ret = curTime.getHours(*3600)+curTime.getMinutes()*60+curTime.getSeconds();
	return ret;*/
}
function update() {
	var nextShowTimeSeconds=getCurrentShowTimeSeconds();
	
	var nextHours = parseInt(nextShowTimeSeconds/60/60);
	var nextMinutes=parseInt(nextShowTimeSeconds/60%60);
	var nextSeconds=parseInt(nextShowTimeSeconds%60);
	
	var curHours=parseInt(curShowTimeSeconds/60/60);
	var curMinutes=parseInt(curShowTimeSeconds/60%60);
	var curSeconds=curShowTimeSeconds%60;
	
	if (nextSeconds!=curSeconds) {
		if(parseInt(curHours/10)!=parseInt(nextHours/10)){
        addBalls(MARGIN_LEFT,MARGIN_TOP,parseInt(curHours/10));      
        }
          if(parseInt(curHours%10)!=parseInt(nextHours%10)){
        addBalls(MARGIN_LEFT+15*(r+1),MARGIN_TOP,parseInt(curHours%10));     
        }
         if(parseInt(curMinutes/10)!=parseInt(nextMinutes/10)){
        addBalls(MARGIN_LEFT+39*(r+1),MARGIN_TOP,parseInt(curMinutes/10));       
        }
          if(parseInt(curMinutes%10)!=parseInt(nextMinutes%10)){
        addBalls(MARGIN_LEFT+54*(r+1),MARGIN_TOP,parseInt(curMinutes%10));       
        }
 
         if(parseInt(curSeconds/10)!=parseInt(nextSeconds/10)){
        addBalls(MARGIN_LEFT+78*(r+1),MARGIN_TOP,parseInt(curSeconds/10));       
        }
          if(parseInt(curSeconds%10)!=parseInt(nextSeconds%10)){
        addBalls(MARGIN_LEFT+93*(r+1),MARGIN_TOP,parseInt(curSeconds%10));      
        }       
		curShowTimeSeconds=nextShowTimeSeconds;
	}
	updateBalls();
	
	console.log(balls.length);
}
function updateBalls(){
	for (var i=0;i<balls.length;i++) {
		balls[i].x+=balls[i].vx;
		balls[i].y+=balls[i].vy;
		balls[i].vy+=balls[i].g;
		
		//碰撞检测
		if (balls[i].y>=WINDOW_HEIGHT-r){
			balls[i].y=WINDOW_HEIGHT-r;
			balls[i].vy=-balls[i].vy*0.75;
			
		}
	}
	
	//性能优化
	var cnt =0;//记录小球的数量
	for(var i=0;i<balls.length;i++) {
		//小球的左边缘不能小于0,且右边缘不能大于画面宽度,即表明小球还在画布中
		if (balls[i].x+r>0 && balls[i].x-r<WINDOW_WIDTH) {
			balls[cnt++]=balls[i];	
		}
	}
	while(balls.length>Math.min(300,cnt)){
			balls.pop();//清除,因为小球一直在增加,而没有减少
		}
}

function addBalls(x,y,num) {
	for (var i=0;i<digit[num].length;i++) {
		for (var j=0;j<digit[num][i].length;j++) {
			if (digit[num][i][j]==1) {
				var aBall={
					x:x+j*2*(r+1)+(r+1),
					y:y+i*2*(r+1)+(r+1),
					g:1.5+Math.random(),
					vx:Math.pow(-1,Math.ceil(Math.random()*100))*4,
					vy:-5,
					color:colors[Math.floor(Math.random()*colors.length)]
				};
				
				balls.push(aBall);
			}
		}
		
	}
}
function render(ctx) {
	ctx.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);
	/*倒计时*/
	var hours = parseInt(curShowTimeSeconds/3600);
	var minutes = parseInt(curShowTimeSeconds/60%60);
	var seconds = curShowTimeSeconds%60;
	
	renderDigit(MARGIN_LEFT,MARGIN_TOP,parseInt(hours/10),ctx);
	renderDigit(MARGIN_LEFT+15*(r+1),MARGIN_TOP,parseInt(hours%10),ctx);
	renderDigit(MARGIN_LEFT+30*(r+1),MARGIN_TOP,10,ctx);
	renderDigit(MARGIN_LEFT+39*(r+1),MARGIN_TOP,parseInt(minutes/10),ctx);
	renderDigit(MARGIN_LEFT+54*(r+1),MARGIN_TOP,parseInt(minutes%10),ctx);
	renderDigit(MARGIN_LEFT+69*(r+1),MARGIN_TOP,10,ctx);
	renderDigit(MARGIN_LEFT+78*(r+1),MARGIN_TOP,parseInt(seconds/10),ctx);
	renderDigit(MARGIN_LEFT+93*(r+1),MARGIN_TOP,parseInt(seconds%10),ctx);

	for (var i=0;i<balls.length;i++) {
		ctx.fillStyle=balls[i].color;
		ctx.beginPath();
		ctx.arc(balls[i].x,balls[i].y,r,0,2*Math.PI,true);
		ctx.closePath();
		ctx.fill();
		
	}

}
function renderDigit(x,y,num,ctx){
	ctx.fillStyle="rgb(0,102,153)";
	
	for (var i=0;i<digit[num].length;i++) {
		for (var j=0;j<digit[i].length;j++) {
			if (digit[num][i][j]===1) {
				ctx.beginPath();
				ctx.arc(x+j*2*(r+1)+(r+1),y+i*2*(r+1)+(r+1),r,0,2*Math.PI);
				ctx.closePath();
				ctx.fill();
			}
			
		}
		
	}
}
