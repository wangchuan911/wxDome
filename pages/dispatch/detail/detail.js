// pages/dispatch/detail/detail.js
const $OrderService = require('../../../utils/service/orderService');
const $OperService = require('../../../utils/service/operationService');
const $PubConst = require('../../../utils/pubConst');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        operation: {
            code: null,
            codeName: null,
            tacheId: null
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const _this = this
        const eventChannel = this.getOpenerEventChannel()
        // eventChannel.emit('acceptDataFromOpenedPage', { data: 'test' });
        // eventChannel.emit('someEvent', { data: 'test' });
        // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
        eventChannel.on('acceptDataFromOpenerPage', function (data) {
            console.info(data)
            const order = data.data;
            _this.setData({
                order: order
            })

            $OperService.getOrderOperation({
                orderId: data.data.orderId
            }, operationNew => {
                operationNew = operationNew.data.result;
                let code;
                let codeName;
                let tacheId;
                if (operationNew[0]) {
                    const oper = operationNew[0];
                    code = oper.tacheVO.code
                    codeName = oper.tacheVO.tacheName
                    tacheId = oper.tacheVO.tacheId
                } else {
                    const state = $PubConst.operationCodes[order.code]
                    code = order.code;
                    tacheId = order.stateId;
                    codeName = state.name;
                }
                _this.setData({
                    ['operation.code']: code,
                    ['operation.codeName']: codeName,
                    ['operation.tacheId']: tacheId
                })
            });
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
    selectDealManBut: function (e) {
        const _this = this
        let order = this.data.order
        wx.navigateTo({
            url: '/pages/dispatch/workers/workers',
            events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                acceptDataFromOpenedPage: function (data) {
                    console.log(data.data.worker);
                    order.worker = data.data.worker;
                    _this.setData({
                        order: order
                    })
                },
                // someEvent: function (data) {
                //   console.log(data)
                // }

            },
            success: function (res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', {
                    data: order.id
                })
            }
        })
    },
    dispathBut: function () {
        const _this = this;
        const data = {
            orderId: this.data.order.orderId,
            tacheId: this.data.operation.tacheId,
            info: {
                setWorker: _this.data.order.worker.id
            }
        }
        switch (this.data.operation.code) {
            case "dispatch": {
                if (!this.data.order.worker) {
                    wx.showToast({
                        title: '请选择负责人',
                        image: '/',
                        duration: 2000
                    })
                    return
                }
                const _this = this
                const eventChannel = this.getOpenerEventChannel()
                $OperService.toBeContinue(data, res => {
                    eventChannel.emit('acceptDataFromOpenedPage', {
                        data: {
                            isDeal: true
                        }
                    });
                    wx.navigateBack({})
                })
            }
                break;
        }
    },
    openMapBut: function () {
        const _this = this
        wx.openLocation({
            latitude: _this.data.order.latitude,
            longitude: _this.data.order.longitude,
            scale: 18
        })
    },
    preViewPicture: function (e) {
        const imgUrls = this.data.order.imgs
        wx.previewImage({
            current: imgUrls[e.currentTarget.dataset.idx], // 当前显示图片的http链接
            urls: imgUrls // 需要预览的图片http链接列表
        })
    }
})