// pages/milestone/customer/milestone.js
const $PubConst = require('../../../utils/pubConst.js')
const $OrderService = require('../../../utils/service/orderService');
const $TacheService = require('../../../utils/service/tacheService');
const $Service = require('../../../utils/service/service');
const $OperService = require('../../../utils/service/operationService');
const $Utils = require('../../../utils/util');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orders: [/*
            {
                orderTime: "2019-08-22 11:12:13",
                addr: "南宁市民族大道222号",
                endTime: "2019-08-22 11:12:13",
                vip: true,
                preDate: "2019-08-22 11:12:13",
                carNo: "桂Aaasfdas",
                carType: "奔驰",
                carColor: "红色",
                latitude: 23.099994,
                longitude: 113.324520,
                state: 0,
                imgs0: [
                    'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
                    'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
                    'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
                ]
            },
            {
                orderTime: "2019-08-22 11:12:13",
                addr: "南宁市民族大道222号",
                endTime: "2019-08-22 11:12:13",
                vip: true,
                preDate: "2019-08-22 11:12:13",
                carNo: "桂Aaasfdas",
                carType: "奔驰",
                carColor: "红色",
                latitude: 23.099994,
                longitude: 113.324520,
                state: 3,
                imgs0: [
                    'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
                    'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
                    'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
                ],
                imgs3: [
                    'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
                    'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
                    'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
                ]
            },
            {
                orderTime: "2019-08-22 11:12:13",
                addr: "南宁市民族大道122号xxx村xxxxx屋xxxxxx室",
                endTime: "2019-08-22 11:12:13",
                vip: false,
                preDate: null,
                carNo: "桂A1234",
                carType: "toyota",
                carColor: "蓝色",
                latitude: 23.099994,
                longitude: 113.324520,
                state: 100,
                orderCost: 10.00
            },
            {
                orderTime: "2019-08-22 11:12:13",
                addr: "南宁市民族大道122号",
                endTime: "2019-08-22 11:12:13",
                vip: false,
                preDate: null,
                carNo: "桂Aasdasddd",
                carType: "五林",
                carColor: "白色",
                latitude: 23.099994,
                longitude: 113.324520,
                state: 101,
                orderCost: 10.00
            }*/
        ],
        cols: [
            {
                id: "addr",
                name: "地址"
            },
            {
                id: "orderTime",
                name: "时间"
            },
            {
                id: "worker",
                name: "服务员"
            },
        ],
        steps: $PubConst.customer.step1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const role = $Service.getRole()
        /*{
            const taches = $TacheService.getLocalTaccheMap()
            if (taches && taches.length > 0) {
                for (let i in taches) {
                    taches[i] = {
                        id: taches[i].tacheId,
                        state: taches[i].seq,
                        name: taches[i].tacheName,
                        desc: "正在" + taches[i].tacheName,
                        code: taches[i].code
                    }
                }
                this.setData({
                    ["steps"]: taches
                })
            }
        }*/
        this.setData({
            ["steps"]: $PubConst.customer.step1
        })
        const _this = this
        const eventChannel = this.getOpenerEventChannel()
        // eventChannel.emit('acceptDataFromOpenedPage', { data: 'test' });
        // eventChannel.emit('someEvent', { data: 'test' });
        // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
        eventChannel.on('acceptDataFromOpenerPage', function (data) {
            switch (data.mode) {
                case 0:
                    $OrderService.getOrders({
                        custId: wx.getStorageSync("openId"),
                    }, function (res) {
                        let orders = res.data.result || [];
                        for (let i = 0; i < orders.length; i++) {
                            orders[i] = _this.modelChange(orders[i])
                            orders[i].isCustOrder = role == 0
                            orders[i].isWorkOrder = !(role == 0)
                        }
                        _this.setData({
                            ['orders']: orders
                        })
                    })
                    break;
                default:
            }
        });
        const steps = this.data.steps.reverse()
        this.setData({
            steps: steps
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
        /*const isWorker = wx.getStorageSync("isWorker");
        console.info("isWorker:" + isWorker)
        let orders = this.data.orders || []
        for (let idx in orders) {
            if (isWorker) {
                orders[idx].isWorkOrder = true
                orders[idx].isCustOrder = false
            } else {
                orders[idx].isCustOrder = true
                orders[idx].isWorkOrder = false
            }
        }
        this.setData({
            orders: orders
        })*/
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
    orderDetailBut: function (e) {
        const order = this.data.orders[e.currentTarget.dataset.idx]
        $OperService.getOrderOperation({
            orderId:order.orderId
        }, success => {
            wx.navigateTo({
                url: '/pages/customer/detail/detail',
                events: {
                    // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                    acceptDataFromOpenedPage: function (data) {
                        console.log(data)
                    },
                },
                success: function (res) {
                    // 通过eventChannel向被打开页面传送数据
                    res.eventChannel.emit('acceptDataFromOpenerPage', {order: order})
                }
            })
        });
    },
    payBillBut: function () {
        wx.requestPayment({
            timeStamp: "" + new Date().getTime(),
            nonceStr: '',
            package: '',
            signType: 'MD5',
            paySign: '',
            success(res) {
                console.info("aa")
            },
            fail(res) {
            }
        })
    },
    preViewPicture: function (e) {
        const imgs = this.data.orders[e.currentTarget.dataset.idx]['imgs' + e.currentTarget.dataset.imgIdx] || [];
        const img = imgs[0]
        wx.previewImage({
            current: img, // 当前显示图片的http链接
            urls: imgs // 需要预览的图片http链接列表
        })
    },
    evalueteBut: function (event) {
        const order = this.data.orders[event.currentTarget.dataset.idx];
        wx.navigateTo({
            url: '/pages/customer/evaluate/evaluate',
            events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                acceptDataFromOpenedPage: function (data) {
                    if (data.data.rated) {
                        console.info("工单已评价")
                    }
                },
            },
            success: function (res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', {order: order})
            }
        })
    },
    callHelpBut: function (event) {
        console.info(event.detail)
    },
    callWorkerBut: function (event) {
        console.info(event.detail)
    },
    foldBut: function (e) {
        const order = this.data.orders[e.currentTarget.dataset.idx];
        this.setData({
            ['orders[' + e.currentTarget.dataset.idx + '].fold']: !order.fold
        })
    },
    modelChange: function (data) {//模型转换
        const _this = this;
        const object = {
            orderId:data.orderId,
            orderTime: $Utils.formatTime(new Date(data.createDate)),
            addr: data.carAddress,
            endTime: data.finishDate != null ? $Utils.formatTime(new Date(data.finishDate)) : "",
            vip: data.custLevel ? data.custLevel : "",
            preDate: data.orderArrangeDate ? $Utils.formatTime(new Date(data.orderArrangeDate)) : "",
            carNo: data.carLicenseNumber,
            carType: "xxx",
            carColor: "xxxxx",
            latitude: data.posX,
            longitude: data.posY,
            imgs0: [
                'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
                'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
                'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
            ]
        }
        const state = _this.data.steps.find(value => {
            return value.id == data.tacheId
        })
        object.state = state.state;
        object.code = state.code;
        return object
    }
})