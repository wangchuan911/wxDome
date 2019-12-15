// pages/mime/mine.js
const app = getApp()
const $Service = require('../../../utils/service/service');
const $UserService = require('../../../utils/service/userService');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        roleMode: -1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        {
            this.setData({
                switchButChecked: wx.getStorageSync("isWorker"),
                switchButChecked2: wx.getStorageSync("isAdmin")
            });
        }
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
                this.setData({
                    roleMode: 0
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
        const role = $Service.getRole();
        this.setData({
            roleMode: role
        })
        return role;
    }
})