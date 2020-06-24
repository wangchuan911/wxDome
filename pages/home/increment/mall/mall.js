// pages/home/increment/mall/mall.js
const $MallService = require("../../../../utils/service/increment/MallService"),
    {extend} = require("../../../../utils/util");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goods: [],
        modal: {
            visible: false,
            title: null,
        },
        select: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        $MallService.getGoods({}, success => {
            this.setData({
                ["goods"]: success.data.result
            })
        }, error => {

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
    selectGoodsBut({currentTarget, detail}) {
        const _this = this, select = {num: 1};
        extend(_this.data.goods[currentTarget.dataset.idx], select)
        this.setData({
            ['modal.visible']: true,
            ["select"]: select
        })
    },
    modalOkBut() {
        this.modalCloseBut()
    },
    modalCloseBut() {
        this.setData({
            ['modal.visible']: false,
            ["select"]: null
        })
    },
    numBut({detail}) {
        this.setData({
            ["select.num"]: detail.value
        })
    }
})