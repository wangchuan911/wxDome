let wave = function (ctx, oRange, option) {
    let tid;
    //oRange = document.getElementsByName("range")[0];
    let M = Math;
    let Sin = M.sin;
    let Cos = M.cos;
    let Sqrt = M.sqrt;
    let Pow = M.pow;
    let PI = M.PI;
    let Round = M.round;
    let oW = (option || {}).width || 150;
    let oH = (option || {}).heigth || 150;
    // 线宽
    let lineWidth = 2;
    // 大半径
    let r = (oW / 2);
    let cR = r - 10 * lineWidth;
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    // 水波动画初始参数
    let axisLength = 2 * r - 16 * lineWidth;  // Sin 图形长度
    let unit = axisLength / 9; // 波浪宽
    let range = .4 // 浪幅
    let nowrange = range;
    let xoffset = 8 * lineWidth; // x 轴偏移量

    let data = ~~(oRange) / 100;   // 数据量

    let sp = 0; // 周期偏移量
    let nowdata = 0;
    let waveupsp = 0.006; // 水波上涨速度
    // 圆动画初始参数
    let arcStack = [];  // 圆栈
    let bR = r - 8 * lineWidth;
    let soffset = -(PI / 2); // 圆动画起始位置
    let circleLock = true; // 起始动画锁
    // 获取圆动画轨迹点集
    for (let i = soffset; i < soffset + 2 * PI; i += 1 / (8 * PI)) {
        arcStack.push([
            r + bR * Cos(i),
            r + bR * Sin(i)
        ])
    }
    // 圆起始点
    let cStartPoint = arcStack.shift();
    ctx.strokeStyle = "#1c86d1";
    ctx.moveTo(cStartPoint[0], cStartPoint[1]);
    // 开始渲染
    // render();
    function drawSine() {
        ctx.beginPath();
        ctx.save();
        let Stack = []; // 记录起始点和终点坐标
        for (let i = xoffset; i <= xoffset + axisLength; i += 20 / axisLength) {
            let x = sp + (xoffset + i) / unit;
            let y = Sin(x) * nowrange;
            let dx = i;
            let dy = 2 * cR * (1 - nowdata) + (r - cR) - (unit * y);
            ctx.lineTo(dx, dy);
            Stack.push([dx, dy])
        }
        // 获取初始点和结束点
        let startP = Stack[0]
        let endP = Stack[Stack.length - 1]
        ctx.lineTo(xoffset + axisLength, oW);
        ctx.lineTo(xoffset, oW);
        ctx.lineTo(startP[0], startP[1])
        ctx.fillStyle = "#4BEF8B";

        ctx.fill();
        ctx.restore();
    }

    function drawText() {
        ctx.globalCompositeOperation = 'source-over';
        let size = 0.4 * cR;
        ctx.font = 'bold ' + size + 'px Microsoft Yahei';
        let number = (nowdata.toFixed(2) * 100).toFixed(0);
        let txt = number + '%';
        let fonty = r + size / 2;
        let fontx = r - size * 0.8;

        if (number >= 55) {
            ctx.fillStyle = "#FFFFFF";
        } else {
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
                let t = range * 0.01;
                nowrange -= t;
            }
        } else if (data <= 0.1) {
            if (nowrange < range * 1.5) {
                let t = range * 0.01;
                nowrange += t;
            }
        } else {
            if (nowrange <= range) {
                let t = range * 0.01;
                nowrange += t;
            }
            if (nowrange >= range) {
                let t = range * 0.01;
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

    let lastFrameTime = 0;

    // 模拟 requestAnimationFrame
    function doAnimationFrame(callback) {
        let currTime = new Date().getTime();
        let timeToCall = Math.max(0, 40 - (currTime - lastFrameTime));
        let id = setTimeout(function () {
            callback(currTime + timeToCall);
        }, timeToCall);
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
        change: valueChange,
        stop: function () {
            abortAnimationFrame(tid)
        },
        start: function () {
            // 开始渲染
            render();
        },
        preStart: function (option) {
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
            if ((option || {}).text) {
                ctx.globalCompositeOperation = 'source-over';
                let size = 0.4 * cR;
                ctx.font = 'bold ' + size + 'px Microsoft Yahei';
                let txt = (option || {}).text;
                let fonty = r + size / 2;
                let fontx = r - size * 0.8;
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