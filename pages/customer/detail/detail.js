// pages/customer/detail/detail.js
const $PubConst = require('../../../utils/pubConst.js')
const $OperService = require('../../../utils/service/operationService');
const $TacheService = require('../../../utils/service/tacheService');
const $OrderService = require('../../../utils/service/orderService');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        current: 0,
        verticalCurrent: 0,
        steps: $PubConst.worker.step1,
        scroll: {
            left: 0,
            stepWidth: 100,
            initPos: 2,
            scrollViewWidth: 600
        },
        operation: {
            codes: $PubConst.operationCodes,
            butText: null,
            code: null,
            operationTacheId: null,
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            ["steps"]: $PubConst.customer.step1
        })

        const _this = this
        const eventChannel = this.getOpenerEventChannel()
        // eventChannel.emit('acceptDataFromOpenedPage', { data: 'test' });
        // eventChannel.emit('someEvent', { data: 'test' });
        // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
        wx.getSystemInfo({
            success: function (res) {
                _this.data.scroll.scrollViewWidth = res.screenWidth
                _this.data.scroll.stepWidth = parseInt(res.screenWidth / (_this.data.scroll.initPos + 1))
            }
        })
        eventChannel.on('acceptDataFromOpenerPage', function (data) {
            _this.reloadOrder(data)
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
    deal: function () {
        const _this = this;
        const eventChannel = this.getOpenerEventChannel()
        const data = {
            orderId: this.data.order.orderId,
            tacheId: this.data.operation.operationTacheId,
        };
        switch (this.data.operation.code) {
            case "reach":
                data.doNext = true
                break;
            default:
                return;
        }
        $OperService.toBeContinue(data, operation => {
            operation = operation.data.result
            switch (operation.tacheId) {
                case $TacheService.STATE.END:
                    $OrderService.getOrder({
                        orderId: data.orderId
                    }, order => {
                        order = $OrderService.modelChange(order.data.result);
                        eventChannel.emit('acceptDataFromOpenedPage', {
                            data: {
                                order: order
                            }
                        });
                        $OperService.getOrderOperation({
                            orderId: order.orderId
                        }, operationNew => {
                            operationNew = operationNew.data.result;
                            _this.reloadOrder({order: order, operation: operationNew})
                        });
                    })
                    break;
                case $TacheService.STATE.WAIT:
                    break;
            }

        }, function () {

        }, function () {

        })
    },
    reloadOrder: function (data) {
        const _this = this
        console.info(data)
        _this.setData({
            order: data.order
        })
        let idx = -1;
        const state = _this.data.steps.find((value, index) => {
            const order = data.order;
            const val = (value.id == order.stateId);
            if (val) idx = index;
            return val;
        })
        _this.setData({
            current: idx,
        })
        _this.changeScroll()
        if (data.operation.length > 0) {
            const operation = data.operation[0];
            _this.setData({
                ['operation.operationTacheId']: operation.tacheId,
                ['operation.butText']: ($PubConst.operationCodes[operation.tacheVO.code] || {}).name,
                ['operation.code']: operation.tacheVO.code
            })
        } else {
            _this.setData({
                ['operation.operationTacheId']: state.id,
                ['operation.butText']: ($PubConst.operationCodes[state.code] || {}).name,
                ['operation.code']: state.code
            })
        }
    },
    changeScroll: function () {
        const initPos = this.data.scroll.initPos;
        const _this = this
        if (this.data.current >= this.data.scroll.initPos && this.data.current < (this.data.steps.length - 1)) {
            this.setData({
                ['scroll.left']: _this.data.scroll.stepWidth * ((_this.data.current || 1) - 1)
            })
        }
        console.info(this.data.scroll)
    },
    addPicture: function () {
        const _this = this
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths
                const imgUrls = (_this.data.imgUrls || []).concat(tempFilePaths)
                _this.setData({
                    imgUrls: imgUrls
                })
            }
        })
    },
    preViewPicture: function (e) {
        const imgUrls = this.data.order.imgs
        wx.previewImage({
            current: imgUrls[e.currentTarget.dataset.idx], // 当前显示图片的http链接
            urls: imgUrls // 需要预览的图片http链接列表
        })
    },
    openMapBut: function () {
        const _this = this
        wx.openLocation({
            latitude: _this.data.order.latitude,
            longitude: _this.data.order.longitude,
            scale: 18
        })
    },
    scroll: function (e) {
        console.info(e.detail);
        this.data.scroll.stepWidth = parseInt(e.detail.scrollWidth / this.data.steps.length);
        this.data.scroll.scrollViewWidth = e.detail.scrollWidth
    }
})