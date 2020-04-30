// pages/dispatch/workers/workers.js
const $UserService = require('../../../utils/service/userService'),
    qqmapsdk = require('../../../utils/thrid/qqmap-wx-jssdk.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        workers: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const _this = this;
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('acceptDataFromOpenerPage', function (data) {
            console.info(data)
            _this.setData({
                order: data.data
            })
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        const _this = this;
        const getTimeLong = (mileSeccend) => {
            const arr = [[1000, '秒'], [60, '分'], [60, '时'], [24, '天']]
            let long = (new Date().valueOf() - mileSeccend);
            let suffix;
            for (let i = 0; i < arr.length; i++) {
                if (long > arr[i][0]) {
                    long /= arr[i][0];
                    suffix = arr[i][1];
                    continue;
                }
                break;
            }
            long = parseInt(long);
            return {long, suffix}
        }

        $UserService.getWorkers({orderId: _this.data.order.orderId}, function (res) {
            _this.setData({
                ['workers']: res.data.result
            })
            const from = _this.data.order.latitude + ',' + _this.data.order.longitude;
            (res.data.result || []).forEach((worker, index) => {
                if (!worker.workerStatus) return
                const key = 'workers[' + index + ']';
                _this.setData({
                    [key + '.orders']: worker.workerStatus.orders,
                    [key + '.lastPosTime']: getTimeLong(worker.workerStatus.lastPosDate)
                })
                /*const to = worker.workerStatus.posX + ',' + worker.workerStatus.posY
                qqmapsdk.calculateDistance({
                    mode: "straight",
                    from,
                    to,
                    success: (res) => {
                        _this.setData({
                            ['workers[' + index + '].distance']: (res.elements[0] || {}).distance
                        })
                    }
                })*/

            });
            const noPos = worker => (worker.workerStatus || {}).posX && (worker.workerStatus || {}).posY;
            const to = (res.data.result || [])
                .filter(noPos)
                .map(worker => worker.workerStatus.posX + ',' + worker.workerStatus.posY)
                .join(";");
            qqmapsdk.calculateDistance({
                mode: "straight",
                from,
                to,
                success: (res) => {
                    console.info(res.result.elements);
                    res.result.elements.forEach((element) => {
                        _this.data.workers.forEach((worker, index) => {
                            if (!noPos(worker) || worker.distance
                                || (element.to.lat != worker.workerStatus.posX
                                    && element.to.lng != worker.workerStatus.posY)) return;
                            _this.setData({
                                ['workers[' + index + '].distance']: (element.distance / 1000).toFixed(2)
                            })
                        })
                    });

                }
            });
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    dispatchBut(e) {
        const _this = this
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.emit('acceptDataFromOpenedPage', {
            data: {
                worker: _this.data.workers[e.target.dataset.idx]
            }
        });
        wx.navigateBack({})
    }
})