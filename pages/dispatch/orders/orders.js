// pages/dispatch/orders/orders.js
const $OrderService = require('../../../utils/service/core/orderService');
const $UserService = require('../../../utils/service/core/userService');
const $Service = require('../../../utils/service/core/service');
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
        carNo:"桂Aaasfdas",
        carType:"奔驰",
        carColor:"红色",
        latitude: 23.099994,
        longitude: 113.324520,
        imgs: [
          'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
          'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
          'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
        ]
      },
      {
        orderTime: "2019-08-22 11:12:13",
        addr: "南宁市民族大道122号",
        endTime: "2019-08-22 11:12:13",
        vip: false,
        preDate: null,
        carNo:"桂A1234",
        carType:"toyota",
        carColor:"蓝色",
        latitude: 23.099994,
        longitude: 113.324520,
        imgs: [
          'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
          'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
          'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
        ]
      },
      {
        orderTime: "2019-08-22 11:12:13",
        addr: "南宁市民族大道122号",
        endTime: "2019-08-22 11:12:13",
        vip: false,
        preDate: null,
        carNo:"桂Aasdasddd",
        carType:"五林",
        carColor:"白色",
        latitude: 23.099994,
        longitude: 113.324520,
      }
    */],
        current: 'tab1',
        current_scroll: 'tab1'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const role = $Service.getRole()
        const _this = this;
        if (role != 2) {
            wx.navigateBack({})
            return;
        }
        $OrderService.getOrders({
            orderControlPerson: $Service.getUserId()
        }, function (res) {
            let orders = res.data.result || [];
            let doCnt = 0;
            let undoCnt = 0;
            for (let i = 0; i < orders.length; i++) {
                orders[i] = $OrderService.modelChange(orders[i])
                orders[i].orderTimeFormart = orders[i].orderTime.substr(11, 5);
                if (orders[i].isDeal) {
                    doCnt++
                } else {
                    undoCnt++
                }
            }
            _this.setData({
                ['orders']: orders,
                ['doCnt']: doCnt,
                ['undoCnt']: undoCnt
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
        const orders = this.data.orders
        let doCnt = 0;
        let undoCnt = 0;
        if (orders) {
            for (let i = 0; i < orders.length; i++) {
                let order = orders[i]
                if (order.isDeal) {
                    doCnt++
                } else {
                    undoCnt++
                }
            }
        }
        this.setData({
            doCnt: doCnt,
            undoCnt: undoCnt
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
    detailBut: function (e) {
        const orderIdx = e.currentTarget.dataset.idx
        let order = this.data.orders[orderIdx]
        const _this = this
        wx.navigateTo({
            url: '/pages/dispatch/detail/detail',
            events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                acceptDataFromOpenedPage: function (data) {
                    console.log(data.data.isDeal)
                    _this.setData({
                        ['orders[' + orderIdx + '].isDeal']: data.data.isDeal
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
        });
        $Service.setPageState("index.freshOrder", true);
    },
    handleChange({
                     detail
                 }) {
        this.setData({
            current: detail.key
        });
    },

    handleChangeScroll({
                           detail
                       }) {
        this.setData({
            current_scroll: detail.key
        });
    }
})