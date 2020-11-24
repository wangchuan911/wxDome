// pages/dispatch/detail/detail.js
const $OrderService = require('../../../utils/service/core/orderService');
const $OperService = require('../../../utils/service/core/operationService');
const $PubConst = require('../../../utils/pubConst');
const {$Toast} = require('../../../ui/iview/base/index');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        operation: {
            code: null,
            codeName: null,
            tacheId: null
        },
        worker: null,
        cost: 0,
        modal: {
            cost: {
                visible: false
            }
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
                order,
                cost: order.cost / 100
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
                    const state = $PubConst.operationCodes[order.code];
                    if (state) {
                        code = order.code;
                        tacheId = order.stateId;
                        codeName = state.name;
                    }
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
        if (order.isDeal) return;
        wx.navigateTo({
            url: '/pages/dispatch/workers/workers',
            events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                acceptDataFromOpenedPage: function (data) {
                    console.log(data.data.worker);
                    order.worker = data.data.worker.name;
                    _this.setData({
                        ['order']: order,
                        ['worker']: data.data.worker
                    })
                },
                // someEvent: function (data) {
                //   console.log(data)
                // }

            },
            success: function (res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', {
                    data: order
                })
            }
        })
    },
    dispathBut: function () {
        const _this = this;
        const data = {
            orderId: this.data.order.orderId,
            tacheId: this.data.operation.tacheId,
        }
        switch (this.data.operation.code) {
            case "dispatch": {
                if (!this.data.worker) {
                    wx.showToast({
                        title: '请选择负责人',
                        image: '/',
                        duration: 2000
                    })
                    return
                }
                data.info = {
                    setWorker: _this.data.worker.id
                }
                if (this.data.cost * 100 != this.data.order.cost) {
                    data.info.changeCost = this.data.cost * 100;
                }
                const eventChannel = this.getOpenerEventChannel()
                $OperService.toBeContinue(data, res => {
                    eventChannel.emit('acceptDataFromOpenedPage', {
                        data: {
                            isDeal: true
                        }
                    });
                    wx.navigateBack({})
                });
                break;
            }
            default:
                wx.showToast({
                    title: '当前面板不支持单前操作',
                    image: '/',
                    duration: 2000
                });
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
    },
    clearCostBut: function (e) {
        this.data.cost = null;
        this.openModal(e)
    },
    costChangeEvent: function (e) {
        if (!isNaN(e.detail.detail.value)) {
            this.data.cost = e.detail.detail.value
        }
    },
    setCostBut: function (e) {
        if (this.data.cost < 0.01) {
            $Toast({
                content: '不能低于0.01元',
                type: 'error'
            });
            return
        }
        this.setData({
            cost: parseFloat(this.data.cost).toFixed(2)
        })
        this.openModal(e)
    },
    openModal(e) {
        const name = e.currentTarget.dataset.name;
        this.setData({
            [`modal.${name}.visible`]: !this.data.modal[name].visible
        })
    }
})