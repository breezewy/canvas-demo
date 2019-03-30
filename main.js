
var div = document.getElementById('myCanvas');
var ctx = div.getContext('2d');
var action = document.getElementById('actions');

autoSetSize(div);  //把画布的宽高设为的跟视图的一样
listenToUser(div);  //监听鼠标事件做事情

// 橡皮擦
var eraserEnabled = false;  //eraserEnabled变量表示 橡皮擦是否被激活

//onclick 事件时 PC端和手机端都支持的
// 画笔和橡皮擦的切换
pen.onclick = function(){
    eraserEnabled = false;
    pen.classList.add('active');
    eraser.classList.remove('active');
}
eraser.onclick = function(){
    eraserEnabled = true;
    eraser.classList.add('active');
    pen.classList.remove('active');
}



//画笔颜色的切换。
black.onclick = function () {
    ctx.strokeStyle = 'black';
    black.classList.add('active');
    $('#black').siblings().each(function (index, element) {
        console.log(element);
        element.classList.remove('active');
    })
}
red.onclick = function(){
    ctx.strokeStyle = 'red';
    red.classList.add('active');
    $('#red').siblings().each(function (index, element) {
        console.log(element);
        element.classList.remove('active');
    })
}
green.onclick = function () {
    ctx.strokeStyle = 'green';
    green.classList.add('active');
    $('#green').siblings().each(function (index,element) {
        console.log(element);
        
        element.classList.remove('active');
    })
}
blue.onclick = function(){
    ctx.strokeStyle = 'blue';
    blue.classList.add('active');
    $('#blue').siblings().each(function (index, element) {
        console.log(element);

        element.classList.remove('active');
    })
}
yellow.onclick = function () {
    ctx.strokeStyle = 'yellow';
    yellow.classList.add('active');
    $('#yellow').siblings().each(function (index, element) {
        console.log(element);

        element.classList.remove('active');
    })
}
pink.onclick = function () {
    ctx.strokeStyle = 'pink';
    pink.classList.add('active');
    $('#pink').siblings().each(function (index, element) {
        console.log(element);

        element.classList.remove('active');
    })
}

// var eraser = document.getElementById('eraser');
//  如果点击橡皮擦，橡皮擦启用
// eraser.onclick = function () {
//     eraserEnabled = true;
//     action.className = "actions x";
// }
//  如果点击画笔，橡皮擦禁用
// brush.onclick = function () {
//     eraserEnabled = false;
//     action.className = "actions";
// }




//-----------------------------------

//自动设置canvas的size
function autoSetSize(canvas) {
    setSize();

    //当窗口尺寸发生变化时，重新获取视窗的宽高并设置画布的宽高
    window.onresize = function () {
        setSize();
    }

    function setSize() {
        //要想设置全屏的canvas，必须要先获取文档显示区域(视窗)的宽高，不包括滚动条
        var pageWidth = document.documentElement.clientWidth;
        var pageHeight = document.documentElement.clientHeight;
        //然后复制给 画布的宽高属性
        canvas.width = pageWidth;
        canvas.height = pageHeight;
    }
}

//线，本质上是一个一个点组成的，点可以看成是填充过的小圆，所以，我们实现在路径上画圆
// 不过这个画圈，并不是必须的，因为不画圈，也可以通过路径方法划线  
function drawCircle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);   //圆
    // ctx.arc(150, 150, 30, 0, Math.PI)   //半圆

    // 请使用 stroke() 或 fill() 方法在画布上绘制实际的弧。
    ctx.fill();

}

//浏览器监控mouse事件时有频率的，如果画的过快，就会造成点和点之间出现空白，所以我们需要把点和点之间连接
// 这个方法的本质，就是从一个点，到下一个点划线
function drawLine(ox, oy, nx, ny) {
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.moveTo(ox, oy);
    ctx.lineTo(nx, ny);
    ctx.stroke();
    ctx.closePath();
}



function listenToUser(canvas) {
    var using = false;  //这个变量表示是否在用
    var lastPoint = { x: undefined, y: undefined };  //上一个点的坐标

    if(document.body.ontouchstart !== undefined){
        canvas.ontouchstart = function(a){
            var x = a.touches[0].clientX;
            var y = a.touches[0].clientY;
            using = true;
            if (eraserEnabled) {
                ctx.clearRect(x - 5, y - 5, 15, 15);
            } else {
                lastPoint = { x: x, y: y };
            }
        }
        canvas.ontouchmove = function(b){
            var x = b.touches[0].clientX;
            var y = b.touches[0].clientY;
            if (!using) { return };
            if (eraserEnabled) {
                ctx.clearRect(x - 5, y - 5, 10, 10);
            } else {
                var newPonit = { x: x, y: y };
                drawLine(lastPoint.x, lastPoint.y, newPonit.x, newPonit.y);
                lastPoint = newPonit;
            }
        }
        canvas.ontouchend = function(){
            using = false;
        }
    }else{
        canvas.onmousedown = function (a) {
            var x = a.clientX;
            var y = a.clientY;
            using = true;
            //如果橡皮擦开始使用了，就清除掉一个矩形，矩形的左上角的坐标是x,y，矩形的宽高是10
            // 为了让橡皮擦清除的是以鼠标为中心的区域，可以减去矩形宽高的一半
            if (eraserEnabled) {
                ctx.clearRect(x - 5, y - 5, 10, 10);
            } else {
                lastPoint = { x: x, y: y };
                // drawCircle(x,y,1);  不用画圆，也可以
            }
        }
        canvas.onmousemove = function (b) {
            var x = b.clientX;
            var y = b.clientY;
            if (!using) { return };
            if (eraserEnabled) {
                ctx.clearRect(x - 5, y - 5, 10, 10);
            } else {
                var newPonit = { x: x, y: y };
                // drawCircle(x, y, 1);
                drawLine(lastPoint.x, lastPoint.y, newPonit.x, newPonit.y);
                // 当从第一个点画到第二第二个点之后，第二个点就变成了起始点，也就是我们要实时更新第一个点
                lastPoint = newPonit;
            }
        }

        canvas.onmouseup = function () {
            using = false;
        }
    }
   

}