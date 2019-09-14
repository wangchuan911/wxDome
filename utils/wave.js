var wave = function (ctx, oRange,option) {
  var tid;
  //oRange = document.getElementsByName("range")[0];
  var M = Math;
  var Sin = M.sin;
  var Cos = M.cos;
  var Sqrt = M.sqrt;
  var Pow = M.pow;
  var PI = M.PI;
  var Round = M.round;
  var oW = (option || {}).width ||150;
  var oH = (option || {}).heigth ||150;
  // 线宽
  var lineWidth = 2;
  // 大半径
  var r = (oW / 2);
  var cR = r - 10 * lineWidth;
  ctx.beginPath();
  ctx.lineWidth = lineWidth;
  // 水波动画初始参数
  var axisLength = 2 * r - 16 * lineWidth;  // Sin 图形长度
  var unit = axisLength / 9; // 波浪宽
  var range = .4 // 浪幅
  var nowrange = range;
  var xoffset = 8 * lineWidth; // x 轴偏移量

  var data = ~~(oRange) / 100;   // 数据量

  var sp = 0; // 周期偏移量
  var nowdata = 0;
  var waveupsp = 0.006; // 水波上涨速度
  // 圆动画初始参数
  var arcStack = [];  // 圆栈
  var bR = r - 8 * lineWidth;
  var soffset = -(PI / 2); // 圆动画起始位置
  var circleLock = true; // 起始动画锁
  // 获取圆动画轨迹点集
  for (var i = soffset; i < soffset + 2 * PI; i += 1 / (8 * PI)) {
    arcStack.push([
      r + bR * Cos(i),
      r + bR * Sin(i)
    ])
  }
  // 圆起始点
  var cStartPoint = arcStack.shift();
  ctx.strokeStyle = "#1c86d1";
  ctx.moveTo(cStartPoint[0], cStartPoint[1]);
  // 开始渲染
  // render();
  function drawSine() {
    ctx.beginPath();
    ctx.save();
    var Stack = []; // 记录起始点和终点坐标
    for (var i = xoffset; i <= xoffset + axisLength; i += 20 / axisLength) {
      var x = sp + (xoffset + i) / unit;
      var y = Sin(x) * nowrange;
      var dx = i;
      var dy = 2 * cR * (1 - nowdata) + (r - cR) - (unit * y);
      ctx.lineTo(dx, dy);
      Stack.push([dx, dy])
    }
    // 获取初始点和结束点
    var startP = Stack[0]
    var endP = Stack[Stack.length - 1]
    ctx.lineTo(xoffset + axisLength, oW);
    ctx.lineTo(xoffset, oW);
    ctx.lineTo(startP[0], startP[1])
    ctx.fillStyle = "#4BEF8B";

    ctx.fill();
    ctx.restore();
  }
  function drawText() {
    ctx.globalCompositeOperation = 'source-over';
    var size = 0.4 * cR;
    ctx.font = 'bold ' + size + 'px Microsoft Yahei';
    var number = (nowdata.toFixed(2) * 100).toFixed(0);
    var txt = number + '%';
    var fonty = r + size / 2;
    var fontx = r - size * 0.8;

    if (number >= 55) {
      ctx.fillStyle = "#FFFFFF";
    }
    else {
      ctx.fillStyle = "#38D560";
    }
    ctx.textAlign = 'center';
    ctx.fillText(txt, r + 5, r + 20)
  }
  //最外面淡黄色圈
  function drawCircle() {
    ctx.beginPath();
    ctx.lineWidth = 15;
    ctx.strokeStyle = '#fff89d';
    ctx.arc(r, r, cR + 7, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
  }
  //灰色圆圈
  function grayCircle() {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#7ce99e';
    ctx.arc(r, r, cR - 8, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
    ctx.beginPath();
  }
  //橘黄色进度圈
  function orangeCircle() {
    ctx.beginPath();
    ctx.strokeStyle = '#fbdb32';
    //使用这个使圆环两端是圆弧形状
    ctx.lineCap = 'round';
    ctx.arc(r, r, cR - 5, 0 * (Math.PI / 180.0) - (Math.PI / 2), (nowdata * 360) * (Math.PI / 180.0) - (Math.PI / 2));
    ctx.stroke();
    ctx.save()
  }
  //裁剪中间水圈
  function clipCircle() {
    ctx.beginPath();
    ctx.arc(r, r, cR - 10, 0, 2 * Math.PI, false);
    ctx.clip();
  }
  //渲染canvas
  function render() {
    abortAnimationFrame(tid);

    ctx.clearRect(0, 0, oW, oH);
    //最外面淡黄色圈
    //drawCircle();
    //灰色圆圈  
    grayCircle();
    //橘黄色进度圈
    //orangeCircle();
    //裁剪中间水圈  
    clipCircle();
    // 控制波幅
    //oRange.addEventListener("change", function () {
    //  data = ~~(oRange.value) / 100;
    //  console.log("data=" + data)
    //}, 0);
    if (data >= 0.85) {
      if (nowrange > range / 4) {
        var t = range * 0.01;
        nowrange -= t;
      }
    } else if (data <= 0.1) {
      if (nowrange < range * 1.5) {
        var t = range * 0.01;
        nowrange += t;
      }
    } else {
      if (nowrange <= range) {
        var t = range * 0.01;
        nowrange += t;
      }
      if (nowrange >= range) {
        var t = range * 0.01;
        nowrange -= t;
      }
    }
    if ((data - nowdata) > 0) {
      nowdata += waveupsp;
    }
    if ((data - nowdata) < 0) {
      nowdata -= waveupsp
    }
    sp += 0.07;
    // 开始水波动画
    drawSine();
    // 写字
    drawText();

    ctx.draw();

    tid = doAnimationFrame(render);
  }

  var lastFrameTime = 0;
  // 模拟 requestAnimationFrame
  function doAnimationFrame(callback) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 40 - (currTime - lastFrameTime));
    var id = setTimeout(function () { callback(currTime + timeToCall); }, timeToCall);
    lastFrameTime = currTime + timeToCall;
    return id;
  };
  // 模拟 cancelAnimationFrame
  function abortAnimationFrame(id) {
    clearTimeout(id)
  }
  function valueChange(nowValue) {
    data = ~~(nowValue) / 100;
  }
  return {
    change:valueChange,
    stop: function(){
      abortAnimationFrame(tid)
    },
    start:function(){
      // 开始渲染
      render();
    },
    preStart:function(option){
      abortAnimationFrame(tid);

      ctx.clearRect(0, 0, oW, oH);
      //最外面淡黄色圈
      //drawCircle();
      //灰色圆圈  
      grayCircle();
      //橘黄色进度圈
      //orangeCircle();
      //裁剪中间水圈  
      clipCircle();
      if ((option||{}).text){
        ctx.globalCompositeOperation = 'source-over';
        var size = 0.4 * cR;
        ctx.font = 'bold ' + size + 'px Microsoft Yahei';
        var txt = (option || {}).text;
        var fonty = r + size / 2;
        var fontx = r - size * 0.8;
        // ctx.fillStyle = "#FFFFFF";
        ctx.fillStyle = "#38D560";
        ctx.textAlign = 'center';
        ctx.fillText(txt, r + 0, r + 15)
      }
      ctx.draw();
    }
  };
}
module.exports.wave = wave
exports.wave = wave