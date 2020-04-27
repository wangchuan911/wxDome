// pages/dispatch/workers/workers.js
const $UserService = require('../../../utils/service/userService');
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
        $UserService.getWorkers({orderId: _this.data.order.orderId}, function (res) {
            _this.setData({
                ['workers']: res.data.result
            })
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