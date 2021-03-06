// pages/customer/milestone/evaluate/evaluate.js
const $EvaluateService = require('./evaluateService');
const $Utils = require('../../../utils/util');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        rateInfo: [
            {
                name: "服务质量",
                id: "service",
                value: 0
            },
            {
                name: "服务态度",
                id: "service",
                value: 0
            }
        ],
        remarks: "",
        isEvaluate: true
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
            const order = data.order
            $EvaluateService.get({
                orderId: order.orderId,
                userId: order.custId,
            }, success => {
                const flag = success.data.result != null;
                $Utils.setOneData(_this, 'isEvaluate', flag)
                if (flag) {
                    const result = success.data.result;
                    $Utils.setOneData(_this, 'remarks', result.remarks);
                    $EvaluateService.intToStarsVal(result.star).forEach((value, index) => {
                        $Utils.setOneData(_this, 'rateInfo[' + index + '].value', value + 1);
                    });
                }
            })
            _this.setData({
                order: order
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
    textChage(e) {
        e.currentTarget.id = "remarks";
        e.target.id = "remarks";
        this.onChange(e);
    },
    onChange(e) {
        console.info(e)
        const index = e.currentTarget.dataset.idx;
        let key;
        let val;
        switch (e.currentTarget.id) {
            case "remarks":
                key = "remarks";
                val = e.detail.value;
                break;
            case "star" + index:
                key = 'rateInfo[' + index + '].value'
                val = e.detail.index;
                break;
        }
        if (key)
            $Utils.setOneData(this, key, val)
    },
    rateFinBut: function (e) {
        const rates = this.data.rateInfo;
        for (let i = 0; i < rates.length; i++) {
            if (rates[i].value == 0) {
                wx.showToast({
                    title: '请先评价',
                    image: '/',
                    duration: 1500
                });
                return;
            }
        }
        const _this = this;
        const eventChannel = this.getOpenerEventChannel()
        const stars = _this.data.rateInfo
        $EvaluateService.add({
            orderId: _this.data.order.orderId,
            userId: _this.data.order.custId,
            remarks: _this.data.remarks,
            star: [stars[0].value - 1, stars[1].value - 1]
        })
        eventChannel.emit('acceptDataFromOpenedPage', {
            data: {
                reted: true
            }
        });
        wx.navigateBack();
    }
})