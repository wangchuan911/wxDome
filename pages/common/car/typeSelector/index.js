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
        oldMode: false
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
                ['acceptDataFromOpenedPageLv' + indexs.length]: _this.data.oldMode ? function (res) {
                    console.info(res.data.indexs);
                    const value = res.data.indexs;
                    const carType1 = $CarConst.getList(value[0])[value[1]];
                    const carType2 = $CarConst.getList(value[0], value[1], value[2], value[3])
                    eventChannel.emit('acceptDataFromOpenedPage', {
                        data: {
                            indexs: value,
                            name: carType1.name + " " + carType2.text,
                            id: carType2.value
                        }
                    });
                    wx.navigateBack({delta: indexs.length});
                } : function (res) {
                    const len = indexs.length - 1;
                    eventChannel.emit('acceptDataFromOpenedPage' + ((len == 1) ? "" : ("Lv" + len)), res)
                }
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
        const eventChannel = this.getOpenerEventChannel();
        const callBack = (level, indexs) => {
            eventChannel.emit('acceptDataFromOpenedPageLv' + level, {
                data: {
                    indexs: indexs,
                }
            });
        };
        const indexs = [].concat(_this.data.indexs).concat([e.currentTarget.dataset.index1]);
        if (_this.data.oldMode) {
            callBack(_this.data.indexs.length, indexs.concat([e.currentTarget.dataset.index2]));
        } else {
            if (indexs.length == 4) {
                callBack(_this.data.indexs.length, indexs);
            } else {
                wx.navigateTo({
                    url: '/pages/common/car/typeSelector/index',
                    events: {
                        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                        ['acceptDataFromOpenedPageLv' + indexs.length]: function (res) {
                            console.info(res.data.indexs);
                            const value = res.data.indexs;
                            const carType1 = $CarConst.getList(value[0])[value[1]];
                            const carType2 = $CarConst.getList(value[0], value[1], value[2], value[3])
                            eventChannel.emit('acceptDataFromOpenedPageLv' + (indexs.length - 1), {
                                data: {
                                    indexs: value,
                                    name: carType1.name + " " + carType2.text,
                                    id: carType2.value
                                }
                            });
                            wx.navigateBack({delta: indexs.length});
                        },
                    },
                    success: function (res) {
                        // 通过eventChannel向被打开页面传送数据
                        res.eventChannel.emit('acceptDataFromOpenerPage', indexs)
                    }
                })
            }
        }
    }
})