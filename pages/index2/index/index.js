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
        state: {
            freshView: false,
            userCheckFail: true,
        },
        loading: {
            spinVal: 2
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
            value8: '',
            value9: '45'
        },
        dateData: {
            preIndex: [0, 0, 0],
            preArray: $Utils.getDatePicker(new Date()),
            finIndex: [0, 0, 0],
            finArray: $Utils.getDatePicker(new Date()),
        },
        roleMode: -1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        $Utils.UILock(this, 'loading.spin', true);
        $Utils.UILock(this, 'loading.submitBut', true);

        this.getUserInfo()
        this.login();
        this.initMap();
        for (let idx in this.data.serviceType) {
            const type = this.data.serviceType[idx];
            this.data.submitData.value6[type.id] = type.checked
        }
    },
    login: function () {
        const _this = this;
        $Service.login(success => {
            const roloId = _this.getRole();
            _this.data.state.freshView = roloId < 0;
            /*_this.setData({
                ["openType"]: ((roloId == 0) ? "getPhoneNumber" : "getUserInfo")
            })*/
            $TacheService.getTaccheMap({roleMode: roloId})
            const order = _this.data.order
            if (success.work) {
                const work = success.work;
                order.allOrderCount = work.all_nums || 0;
                order.orderCount = work.nums || 0;
                _this.setData({
                    ['progressShow.progress']: order.orderCount == 0 ? 1 : parseInt((order.orderCount / order.allOrderCount) * 100)
                })
            }
            if (roloId > 0 || (((order.allOrderCount || 0) - (order.orderCount || 0)) > 0)) {
                _this.setData({
                    isBook: true,
                    ["openType"]: null
                });
                $Utils.unlockUI(_this, 'loading.submitBut')
                _this.initCircle();
            }
            const carNo = (success.cars || []).length > 0 ? success.cars[0].lisence : null
            $CarService.setDefaultCarNo(carNo);
            _this.userCheck(null, true)
            _this.setSpin();
        }, error => {
            wx.showModal({
                title: '服务异常',
                content: error + '\n请受稍后再试!',
                success(res) {
                    if (res.confirm) {
                        console.log('用户点击确定');
                        _this.login();
                    }
                }
            })
        })
    }, initMap: function () {
        const _this = this;
        wx.getLocation({
            type: 'gcj02',
            success(res) {
                _this.setData({
                    ['markers[0].latitude']: res.latitude,
                    ['markers[0].longitude']: res.longitude,
                })
                qqmapsdk.reverseGeocoder({
                    location: res,
                    success: function (res1) {//成功后的回调
                        _this.setData({
                            ['submitData.value1']: res1.result.address,
                            ['submitData.value8']: res1.result.ad_info.adcode + $Utils.getDate(new Date(), ""),
                            ['submitData.value9']: res1.result.ad_info.adcode
                        })
                        const user = $Service.getUserInfo();
                        _this.data.submitData.value8 += user.id.substr(user.id.length - 5);
                        _this.setSpin();
                    },
                    fail: function (res1) {
                        if (!_this.data.state.freshView) {
                            _this.data.state.freshView = true;
                            $Utils.getPositionAuth();
                        }
                    }
                })
                // const speed = res.speed
                // const accuracy = res.accuracy
            },
            fail(res) {
                _this.data.state.freshView = true;
                $Utils.getPositionAuth();
            }
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        if (this.data.state.freshView) {
            this.onLoad()
        } else {
            if (this.isBook) {
                this.initCircle();
            }
        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        const _this = this;
        if (this.data.state.freshView) {
            this.onLoad()
        } else {
            if (this.circle1) {
                this.data.progressShow.count--
                this.countInterval()
            }
            this.getRole();
            _this.userCheck(null, true)
        }

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
        const _this = this;

        function check() {
            _this.userCheck(null, true)
        }

        if (((e || {}).detail || {}).userInfo) {
            console.log(e)
            app.globalData.userInfo = e.detail.userInfo
            this.setData({
                userInfo: e.detail.userInfo,
                hasUserInfo: true
            })
            check();
        } else {
            if (app.globalData.userInfo) {
                this.setData({
                    userInfo: app.globalData.userInfo,
                    hasUserInfo: true
                })
                check();
            } else if (this.data.canIUse) {
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                app.userInfoReadyCallback = function (res) {
                    _this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                    check();
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
                        check();
                    }
                })
            }
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
    userCheck: function (e, notTip) {
        const noLogin = this.getRole() < 0 || !app.globalData.userInfo;
        const noCarNo = !$CarService.getDefaultCarNo();
        const fail = noLogin || noCarNo;
        if (fail) {
            const msgBody = {};
            if (noLogin) {
                msgBody.msg = '请先登陆';
                msgBody.jumpToPage = "/pages/home/mime/mine"

            } else if (noCarNo) {
                msgBody.msg = '请完善车辆信息';
                msgBody.jumpToPage = "/pages/home/garage/garage"
                /*wx.showModal({
                    title: msgBody.title,
                    content: msgBody.content,
                    success(res) {
                        if (res.confirm) {
                            console.log('用户点击确定');
                            wx.navigateTo({
                                url: "/pages/home/garage/garage"
                            })
                        }
                    }
                })*/
            }
            if (!notTip) {
                wx.showToast({
                    title: msgBody.msg,
                    icon: 'none',
                    duration: 1500,
                    mask: true,
                    complete(res) {
                        setTimeout(function () {
                            wx.navigateTo({
                                url: msgBody.jumpToPage,
                            })
                        }, 1000);
                    }
                })
            }
        } else {
            $Utils.setOneData(this, "state.userCheckFail", fail);
            $Utils.unlockUI(this, 'loading.submitBut');
        }
        return !fail;
    },
    bookBut: function (e) {
        this.getUserInfo(e)
        if (!this.userCheck(e)) return;

        const _this = this
        if ($Utils.isLock(this, 'loading.submitBut')) {
            return
        }

        const lock = $Utils.lockUI(this, 'loading.submitBut');
        $Utils.setOneData(_this, 'isBook', true);

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
                                $Utils.setOneData(_this, 'isBook', false);
                                lock.unlock();
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
                    });
                    lock.unlock();
                } else {
                    _this.setData({
                        isBook: false,
                    });
                    lock.unlock();
                }
            }, function (res) {

            })
        }

        uplaod();
    },
    mileStoneBut: function (e) {
        this.getUserInfo(e)
        if (!this.userCheck(e)) return;
        const lock = $Utils.lockUI(this, 'loading.submitBut');
        const _this = this
        wx.navigateTo({
            url: (_this.data.roleMode == 2) ? '/pages/dispatch/orders/orders' : '/pages/customer/milestone/milestone',
            events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                acceptDataFromOpenedPage: function (data) {
                    console.log(data)
                },
            },
            success: function (res) {
                res.eventChannel.emit('acceptDataFromOpenerPage', {mode: 0})
            },
            complete(res) {
                lock.unlock()
            }
        })
    },
    mine: function (e) {
        // this.getUserInfo();
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
        let data;
        let dataColume;
        const id = e.currentTarget.id;
        switch (id) {
            case "value3":
                data = {
                    multiArray: this.data.dateData.preArray,
                    multiIndex: e.detail.value
                };
                dataColume = "dateData.preIndex";
                break
            case "value4":
                data = {
                    multiArray: this.data.dateData.finArray,
                    multiIndex: this.data.dateData.finIndex
                };
                dataColume = "dateData.finIndex";
                break
            default:
                return;
        }
        this.setData({
            ['submitData.' + id]: function () {
                let str = "";
                for (let i = 0; i < data.multiIndex.length; i++) {
                    str += data.multiArray[i][data.multiIndex[i]]
                }
                return str;
            }(),
            [dataColume]: e.detail.value
        })
    },
    bindMultiPickerColumnChange: function (e) {
        const colum = e.detail.column;
        console.log(e.currentTarget.id + '修改的列为', e.detail.column, '，值为', e.detail.value);
        let data;
        let dataColume;
        let dataColume2;
        const id = e.currentTarget.id;
        switch (id) {
            case "value3":
                data = {
                    multiArray: this.data.dateData.preArray,
                    multiIndex: this.data.dateData.preIndex
                };
                dataColume = "dateData.preIndex";
                dataColume2 = "dateData.preArray";
                break
            case "value4":
                data = {
                    multiArray: this.data.dateData.finArray,
                    multiIndex: this.data.dateData.finIndex
                };
                dataColume = "dateData.finIndex";
                dataColume2 = "dateData.finArray";
                break
            default:
                return;
        }
        data.multiIndex[colum] = e.detail.value;
        switch (colum) {
            case 0:
                let date = $Utils.getPickerDate(data.multiArray[0][data.multiIndex[0]] + data.multiArray[1][data.multiIndex[1]] + data.multiArray[2][data.multiIndex[2]]);
                data.multiArray[1] = $Utils.getDatePickerHour(date.getDate() > (new Date().getDate()));
                data.multiIndex[1] = 0;
            case 1:
                data.multiIndex[2] = 0;
        }
        this.setData({
            [dataColume]: data.multiIndex,
            [dataColume2]: data.multiArray
        })
    },
    countInterval: function () {
        // 设置倒计时 定时器 假设每隔100毫秒 count递增+1，当 count递增到两倍maxCount的时候刚好是一个圆环（ step 从0到2为一周），然后改变txt值并且清除定时器
        const _this = this
        this.clearInterval();
        const progressShow = this.data.progressShow;
        progressShow.countTimer = setInterval(function () {
                if (progressShow.count == progressShow.progress) {
                    return;
                }
                if (progressShow.count != progressShow.maxCount) {
                    // 绘制彩色圆环进度条
                    _this.circle1.drawCircle('circle_draw1', 50, 8, progressShow.count * 2 / progressShow.maxCount)
                    if (progressShow.count < progressShow.progress) {
                        progressShow.count++;
                    } else {
                        progressShow.count--
                    }
                    if (_this.data.roleMode == 0) {
                        _this.setData({
                            txt: progressShow.count + '%',
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
    , getRole() {
        const role = $Service.getRole();
        this.setData({
            roleMode: role
        })
        return role;
    }
    , setSpin() {
        const _this = this;
        if ((--_this.data.loading.spinVal) == 0) {
            $Utils.unlockUI(this, "loading.spin")
        }
    }
})