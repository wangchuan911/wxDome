// pages/mime/mine.js
const app = getApp()
const $Service = require('../../../utils/service/service');
const $UserService = require('../../../utils/service/userService');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        roleMode: -1,
        role: [{
            id: -1,
            name: '路人（未注册）',
        }, {
            id: 0,
            name: '顾客',
        }, {
            id: 1,
            name: '工作人员'
        }, {
            id: 2,
            name: '监管'
        }],
        current: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
        //console.log(option.query)
        // const eventChannel = this.getOpenerEventChannel()
        // eventChannel.emit('acceptDataFromOpenedPage', { data: 'test' });
        // eventChannel.emit('someEvent', { data: 'test' });
        // // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
        // eventChannel.on('acceptDataFromOpenerPage', function (data) {
        //   console.log(data)
        // })
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
        this.getRole()
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
    switchBut: function (e) {
        console.info("switchBut:" + e.detail.value)
        wx.setStorageSync('isWorker', e.detail.value)
        this.setData({
            switchButChecked: wx.getStorageSync("isWorker"),
        });
    },
    switchBut2: function (e) {
        console.info("switchBut2:" + e.detail.value)
        wx.setStorageSync('isAdmin', e.detail.value)
        this.setData({
            switchButChecked2: wx.getStorageSync("isAdmin")
        });
    },
    login: function (e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        });
        if (this.getRole() < 0) {
            $UserService.newUserr({
                name: e.detail.userInfo.nickName
            }, res => {
                $Service.setRole(0);
                this.getRole();
                wx.showModal({
                    title: '完善信息？',
                    content: "是否去完善信息",
                    success(res) {
                        if (res.confirm) {
                            console.log('用户点击确定');
                            wx.navigateTo({
                                url: "/pages/home/garage/garage"
                            })
                        }
                    }
                })
            }, res => {
                wx.showToast({
                    title: '登陆失败',
                    image: '/',
                    duration: 2000
                })
            })
        }
    }, getRole() {
        const _this = this;
        const role = $Service.getRole();
        this.setData({
            roleMode: role,
            current: function () {
                let name = 0;
                _this.data.role.find((value) => {
                    if (value.id == role) {
                        name = value.name;
                        return true;
                    }
                    return false;
                })
                return name;
            }()
        })
        return role;
    },
    goPage: function (e) {
        if (!e.currentTarget.dataset.page) {
            wx.showToast({
                title: "功能即将上线！",
                icon: 'none',
                duration: 2000
            })
            return;
        }
        if (e.currentTarget.dataset.role > this.getRole()) {
            wx.showToast({
                title: e.currentTarget.dataset.role == 0 ? "请先登陆！" : "权限不足请联系管理员",
                icon: 'none',
                duration: 2000
            })
            return;
        }
        wx.navigateTo({
            url: e.currentTarget.dataset.page,
            fail: res => {
                wx.showToast({
                    title: "功能即将上线！",
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },
    roleChangeBut: function ({detail = {}}) {
        const role = this.data.role.find(value => value.name == detail.value) || {};
        if (this.data.roleMode >= 0 && role.id < 0) {
            this.setData({
                current: detail.value
            })
            return;
        };
        $UserService.updateUser({role: role.id}, res => {
            this.setData({
                current: detail.value
            });
        })
    }
})