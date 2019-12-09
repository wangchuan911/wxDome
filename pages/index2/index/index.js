// pages/index2/index.js
const app = getApp()
const {$Toast} = require('../../../ui/iview/base/index');
const qqmapsdk = require('../../../utils/thrid/qqmap-wx-jssdk.js');
const $OrderService = require('../../../utils/service/orderService');
const $TacheService = require('../../../utils/service/tacheService');
const $CarService = require('../../../utils/service/carService');
const $Service = require('../../../utils/service/service');
const $PubConst = require('../../../utils/pubConst');
const $Utils = require('../../../utils/util');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loading: {
            spin: true,
            spinVal: 2,
            submitBut: false
        },
        openType: "getPhoneNumber",
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        txt: "",
        progressShow: {
            count: 0, //计数器，初始值为0
            maxCount: 100, // 绘制一个圆环所需的步骤
            progress: 51, // 绘制一个圆环所需的步骤
            countTimer: null //定时器，初始值为null
        },
        order: {
            allOrderCount: 0,
            orderCount: 0
        },
        markers: [{
            //iconPath: "/resources/others.png",
            id: 0,
            latitude: 23.099994,
            longitude: 113.324520,
            width: 50,
            height: 50,
            callout: {
                color: "red",
                content: '详细',
                fontSize: 20,
                borderWidth: 2,
                padding: 10,
                borderRadius: 20,
                textAlign: "center"
            }
        }],
        tags: [{
            checked: false,
            value: null,
            text: "预约",
            id: "book"
        }, {
            checked: false,
            value: null,
            text: "取车时间",
            id: "useTime"
        }, {
            checked: false,
            value: null,
            text: "备注",
            id: "extraInfo"
        }],
        serviceType: $PubConst.optionTaches,
        submitData: {
            value1: null,
            value2: {},
            value3: null,
            value4: null,
            value5: null,
            value6: {},
            value7: {},
            value8: $Utils.getDate(new Date(), "")
        },
        roleMode: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const _this = this;
        this.getUserInfo();
        $Service.login(function (result) {
            let openId = result.openid;
            const roloId = _this.getRole();
            /*_this.setData({
                ["openType"]: ((roloId == 0) ? "getPhoneNumber" : "getUserInfo")
            })*/
            $TacheService.getTaccheMap({roleMode: roloId})
            const order = _this.data.order
            if (result.work) {
                const work = result.work;
                order.allOrderCount = work.all_nums || 0;
                order.orderCount = work.nums || 0;
                _this.setData({
                    ['progressShow.progress']: order.orderCount == 0 ? 1 : parseInt((order.orderCount / order.allOrderCount) * 100)
                })
            }
            if (roloId != 0 || (((order.allOrderCount || 0) - (order.orderCount || 0)) > 0)) {
                _this.setData({
                    isBook: true,
                    ['loading.submitBut']: false,
                    ["openType"]: null
                })
                _this.initCircle();
            }
            if ((result.cars || []).length > 0) {
                $CarService.setDefaultCarNo(result.cars[0].lisence);
            }
            _this.setSpin();
        })
        wx.getLocation({
            type: 'gcj02',
            success(res) {
                _this.setSpin();
                _this.setData({
                    ['markers[0].latitude']: res.latitude,
                    ['markers[0].longitude']: res.longitude,
                })
                qqmapsdk.reverseGeocoder({
                    location: res,
                    success: function (res1) {//成功后的回调
                        _this.setData({
                            ['submitData.value1']: res1.result.address,
                            ['submitData.value8']: res1.result.ad_info.adcode + _this.data.submitData.value8,
                        })
                        const user = $Service.getUserInfo();
                        _this.data.submitData.value8 += user.id.substr(user.id.length - 5);
                    },
                    fail: function (res1) {
                    }
                })
                // const speed = res.speed
                // const accuracy = res.accuracy
            }
        })

        for (let idx in this.data.serviceType) {
            const type = this.data.serviceType[idx];
            if (type.checked) {
                this.data.submitData.value6[type.id] = type.checked
            }
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        if (this.isBook) {
            this.initCircle();
        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        if (this.circle1) {
            this.data.progressShow.count--
            this.countInterval()
        }

        this.getRole();

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        this.clearInterval()
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        this.clearInterval()
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
    getUserInfo: function (e) {
        const _this = this
        if (((e || {}).detail || {}).userInfo) {
            console.log(e)
            app.globalData.userInfo = e.detail.userInfo
            this.setData({
                userInfo: e.detail.userInfo,
                hasUserInfo: true
            })
        } else {
            if (app.globalData.userInfo) {
                this.setData({
                    userInfo: app.globalData.userInfo,
                    hasUserInfo: true
                })
            } else if (this.data.canIUse) {
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                app.userInfoReadyCallback = function (res) {
                    _this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            } else {
                // 在没有 open-type=getUserInfo 版本的兼容处理
                wx.getUserInfo({
                    success: function (res) {
                        app.globalData.userInfo = res.userInfo
                        _this.setData({
                            userInfo: res.userInfo,
                            hasUserInfo: true
                        })
                    }
                })
            }
            wx.getSetting({
                success: function (res) {
                    if (res.authSetting['scope.userInfo']) {
                        wx.getUserInfo({
                            success: function (res) {
                                _this.setData({
                                    userInfo: res.userInfo,
                                    hasUserInfo: true
                                })
                            }
                        })
                    }
                }
            })
        }
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    regionchange(e) {
        console.log(e.type)
    },
    markertap(e) {
        console.log(e.markerId)
    },
    controltap(e) {
        console.log(e.controlId)
    },
    callouttap(e) {
        console.log(e.markerId)
    },
    markMapBut(e) {
        console.info(e)
        this.data.markers[0]
    },
    bookBut: function (e) {
        this.getUserInfo(e)
        if (!$CarService.getDefaultCarNo()) {
            wx.showModal({
                title: '需要登陆',
                content: '您尚未设置车牌号,是否设置',
                success(res) {
                    if (res.confirm) {
                        console.log('用户点击确定');
                        wx.navigateTo({
                            url: "/pages/home/garage/garage"
                        })
                    }
                }
            })
            return;
        }
        if (this.data.loading.submitBut) return
        const _this = this
        _this.setData({
            isBook: true,
            ['loading.submitBut']: true
        })
        console.info("提交")
        console.info(this.data.submitData)
        this.data.submitData.value7 = _this.data.markers[0]

        function uplaod() {
            const pictures = _this.data.submitData.value2.value3 || _this.data.submitData.value2.value2 || [];
            $Service.upload(pictures, {tacheId: 1, orderCode: _this.data.submitData.value8}, complete => {
                if ((complete.fail || []).length > 0) {
                    let quene = [];
                    complete.fail.forEach((value) => {
                        quene.push(value.path)
                    });
                    _this.setData({
                        ['submitData.value2.value3']: quene
                    });
                    wx.showModal({
                        title: '提示',
                        content: '有图片尚未上传成功，是否忽略',
                        success(res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                                newOrder({
                                    pic: complete.success
                                })
                            } else {
                                _this.setData({
                                    isBook: false,
                                    ['loading.submitBut']: false
                                })
                            }
                        }
                    })
                    return;
                } else {
                    newOrder({
                        pic: complete.success
                    })
                }
            });
        }

        function newOrder(data) {
            const form = _this.data.submitData;
            form.value2.pictureIds = $Service.getSuccessPictureIds(data.pic);
            $OrderService.newOrder(form, function (res) {
                console.info(res)
                if (res.data.result) {
                    const orderCounts = res.data.result;
                    _this.initCircle();
                    _this.setData({
                        ['progressShow.progress']: orderCounts.all_nums > 0 ? parseInt(((orderCounts.nums || 0) / orderCounts.all_nums) * 100) : 1,
                        ['loading.submitBut']: false
                    })
                } else {
                    _this.setData({
                        isBook: false,
                        ['loading.submitBut']: false
                    })
                }
            }, function (res) {

            })
        }

        uplaod();
    },
    mileStoneBut: function (e) {
        this.getUserInfo(e)
        const _this = this
        wx.navigateTo({
            url: (_this.data.roleMode == 2) ? '/pages/dispatch/orders/orders' : '/pages/customer/milestone/milestone',
            events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                acceptDataFromOpenedPage: function (data) {
                    console.log(data)
                    wv.change(50);
                },
            },
            success: function (res) {
                res.eventChannel.emit('acceptDataFromOpenerPage', {mode: 0})
            }
        })
    },
    mine: function (e) {
        this.getUserInfo();
        wx.navigateTo({
            url: '/pages/home/mime/mine',
            /*events: {
              // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
              acceptDataFromOpenedPage: function (data) {
                console.log(data)
              },
              someEvent: function (data) {
                console.log(data)
              }
            },
            success: function (res) {
              // 通过eventChannel向被打开页面传送数据
              res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
            }*/
        })
    },
    tagChangeBut(event) {
        const detail = event.detail;
        const _this = this
        console.info(detail);
        switch (this.data.tags[detail.name].id) {
            case "extraInfo":
                _this.extraBut(event)
                break;
            default:
                _this.setData({
                    ['tags[' + event.detail.name + '].checked']: detail.checked
                })
        }

    },
    extraBut: function (event) {
        const _this = this
        let index = event.detail.name ?
            event.detail.name :
            function () {
                for (let idx in _this.data.tags) {
                    if (_this.data.tags[idx].id == 'extraInfo') {
                        return idx;
                    }
                }
                return 2;
            }();

        wx.navigateTo({
            url: '/pages/index2/extra/extra',
            events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                acceptDataFromOpenedPage: function (data) {
                    console.info(data)
                    _this.setData({
                        ['tags[' + index + '].checked']: (data.data.value1 || (data.data.value2 || []).length > 0),
                        ['submitData.value2.value1']: data.data.value1,
                        ['submitData.value2.value2']: (data.data.value2 || []),
                    })
                },
            },
            success: function (res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', {
                    extra: _this.data.submitData.value2
                })
            }
        });
    },
    openMap: function () {
        const _this = this
        wx.chooseLocation({
            type: 'gcj02', //返回可以用于wx.openLocation的经纬度
            success(res) {
                const latitude = res.latitude
                const longitude = res.longitude
                const name = res.name
                const address = res.address
                //返回的指显示到界面上
                _this.setData({
                    ['submitData.value1']: address,
                    ['submitData.value5']: res,
                    ['markers[0].latitude']: latitude,
                    ['markers[0].longitude']: longitude
                })
            }
        })
    },
    changeTime: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            ['submitData.value3']: e.detail.value
        })
    },
    changeTime2: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            ['submitData.value4']: e.detail.value
        })
    },
    countInterval: function () {
        // 设置倒计时 定时器 假设每隔100毫秒 count递增+1，当 count递增到两倍maxCount的时候刚好是一个圆环（ step 从0到2为一周），然后改变txt值并且清除定时器
        const _this = this
        this.clearInterval();
        this.data.progressShow.countTimer = setInterval(function () {
                if (_this.data.progressShow.count == _this.data.progressShow.progress) {
                    return;
                }
                if (_this.data.progressShow.count != _this.data.progressShow.maxCount) {
                    // 绘制彩色圆环进度条
                    _this.circle1.drawCircle('circle_draw1', 50, 8, _this.data.progressShow.count * 2 / _this.data.progressShow.maxCount)
                    if (_this.data.progressShow.count < _this.data.progressShow.progress) {
                        _this.data.progressShow.count++;
                    } else {
                        _this.data.progressShow.count--
                    }
                    if (_this.data.roleMode == 0) {
                        _this.setData({
                            txt: _this.data.progressShow.count + '%',
                        });
                    } else {
                        _this.setData({
                            txt: _this.data.order.orderCount + "/" + _this.data.order.allOrderCount
                        });
                    }

                } else {
                    _this.setData({
                        txt: "完成"
                    });
                    _this.clearInterval();
                }
            },
            100
        )
        console.info("countInterval:" + this.data.progressShow.countTimer)
    },
    clearInterval: function () {
        if (this.data.progressShow.countTimer) {
            clearInterval(this.data.progressShow.countTimer);
            console.info("clearInterval:" + this.data.progressShow.countTimer)
            this.data.progressShow.countTimer = null;
        }
    }
    ,
    initCircle() {
        // 获得circle组件
        this.circle1 = this.selectComponent("#circle1");
        // 绘制背景圆环
        this.circle1.drawCircleBg('circle_bg1', 50, 8);
        this.countInterval()
    },
    selectSrvTypeBut(event) {
        const detail = event.detail;
        const _this = this
        if (!detail.checked) {
            let count = 0;
            for (let idx in this.data.serviceType) {
                if (idx == detail.name) continue
                count = count + (this.data.serviceType[idx].checked) ? 1 : 0;
            }
            if (count == 0) {
                $Toast({
                    content: '请选择一个服务！',
                    type: 'error'
                });
                return;
            }
        }
        this.setData({
            ['serviceType[' + detail.name + '].checked']: detail.checked
        })
        //提交赋值
        this.data.submitData.value6[this.data.serviceType[detail.name].id] = detail.checked
        switch (this.data.serviceType[detail.name].id) {
            case "washOut":
                console.info("washOut");
                break;
            case "washIn":
                console.info("washIn");
                break;
            default:

        }
    }
    , getRole(_this) {
        const role = $Service.getRole();
        (_this || this).setData({
            roleMode: role
        })
        return role;
    }
    , setSpin() {
        const _this = this;
        if (--_this.data.loading.spinVal == 0) {
            _this.setData({
                ['loading.spin']: false
            })
        }
    }
})