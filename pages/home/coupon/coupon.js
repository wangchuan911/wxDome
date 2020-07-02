// pages/home/coupon/coupon.js
const $CouponService = require("../../../utils/service/increment/couponService.js"),
    $CarService = require("../../../utils/service/core/carService.js"),
    {$Message} = require('../../../ui/iview/base/index');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        coupons: [],
        selectMode: false,
        currentSerivce: null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const eventChannel = this.getOpenerEventChannel(), _this = this;
        eventChannel.on('acceptDataFromOpenerPage', (data) => {
            if ((data || {}).coupons) {
                _this.data.selectMode = true;
                _this.setData({
                    ["coupons"]: data.coupons,
                    ["currentSerivce"]: (data || {}).service
                })
            } else {
                $CouponService.getCoupons(success => {
                    _this.setData({
                        ["coupons"]: success.data.result,
                        ["currentSerivce"]: (data || {}).service
                    })
                })
            }
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
    selectBut({currentTarget = {}}) {
        const dataset = currentTarget.dataset || {};
        const {idx} = dataset;
        if (this.data.selectMode) {
            const carType = $CarService.getDefaultCarType();
            const coupon = this.data.coupons[idx],
                defineType = ((coupon || {}).defineType || "").split("|");
            if (carType != null && defineType[0] && defineType[0] != carType) {
                $Message({content: "默认车辆类型为:" + carType + "!不能使用此券"});
                return;
            }
            if (this.data.currentSerivce && defineType[1] && defineType[1] != this.data.currentSerivce) {
                $Message({content: "当前服务类型不能使用此券"});
                return;
            }
            const eventChannel = this.getOpenerEventChannel();
            eventChannel.emit('acceptDataFromOpenedPage', {
                data: coupon
            });
            wx.navigateBack({})
        }
    }
})