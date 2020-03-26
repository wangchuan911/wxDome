// pages/common/car/typeSelector/index.js

const $Utils = require('../../../../utils/util');
const $CarConst = require('../../../../utils/carConst');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        scrollTop: 0,
        show: 0,
        index: [0, 0],
        carTypes: [],
        heigth: 300,
        indexs: null,
        mode:2,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const _this = this;
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.on('acceptDataFromOpenerPage', (data) => {
            _this.data.indexs = data;
            const show = (data == null) ? 1 : _this.data.indexs.length;
            _this.setData({
                ["show"]: show,
            });
            const getCarType = (show, indexs) => show == 1 ? $CarConst.getList() : show == 2 ? $CarConst.getList(indexs[0], indexs[1]) : $CarConst.getList(indexs[0], indexs[1], indexs[2]);
            const carTypes = getCarType(show, _this.data.indexs);
            if ((carTypes || []).length == 0) {
                $CarConst.cacheCarData({
                    level: _this.data.show,
                    indexs: data
                }, success => {
                    _this.setData({
                        ["carTypes"]: getCarType(show, _this.data.indexs)
                    });
                })
            } else {
                _this.setData({
                    ["carTypes"]: carTypes,
                })
            }
        })
        wx.getSystemInfo({
            success(res) {
                $Utils.setOneData(_this, "heigth", res.windowHeight)
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        /*let storeCity = new Array(26);
        const words = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
        words.forEach((item, index) => {
            storeCity[index] = {
                key: item,
                list: []
            }
        })
        cities.forEach((item) => {
            let firstName = item.pinyin.substring(0, 1);
            let index = words.indexOf(firstName);
            storeCity[index].list.push({
                name: item.name,
                key: firstName
            });
        })
        this.data.cities = storeCity;
        this.setData({
            cities: this.data.cities
        })*/
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
    showCardTypeBut: function (e) {
        const _this = this;
        const eventChannel = this.getOpenerEventChannel()
        console.info(e);
        const indexs = [e.currentTarget.dataset.index1, e.currentTarget.dataset.index2];
        wx.navigateTo({
            url: '/pages/common/car/typeSelector/index',
            events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                ['acceptDataFromOpenedPageLv' + indexs.length]: function (res) {
                    console.info(res.data.indexs);
                    const value = [].concat(indexs).concat(res.data.indexs);
                    const carType1 = _this.data.carTypes[value[0]].items[value[1]];
                    const carType2 = carType1.list[value[2]].list[value[3]]
                    eventChannel.emit('acceptDataFromOpenedPage', {
                        data: {
                            indexs: value,
                            name: carType1.name + " " + carType2.text,
                            id: carType2.value
                        }
                    });
                    wx.navigateBack({delta: 2});
                },
            },
            success: function (res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', indexs)
            }
        })
        /*
                $Utils.setOneData(this, "show", true);
                $Utils.setOneData(this, "indexs", [e.currentTarget.dataset.index1, e.currentTarget.dataset.index2]);*/
    },
    onChange(event) {
        console.log(event.detail, 'click right menu callback data')
    },
    //页面滚动执行方式
    onPageScroll(event) {
        this.setData({
            scrollTop: event.scrollTop
        })
    },
    selectCarTypeBut(e) {
        console.info(e);
        const _this = this
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.emit('acceptDataFromOpenedPageLv' + _this.data.indexs.length, {
            data: {
                indexs: [e.currentTarget.dataset.index1, e.currentTarget.dataset.index2],
            }
        });
    }
})