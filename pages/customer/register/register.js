// pages/customer/register/register.js
const $Service = require('../../../utils/service/service'),
    $UserService = require('../../../utils/service/userService'),
    app = getApp(),
    $Utils = require('../../../utils/util'),
    {$Message} = require('../../../ui/iview/base/index'),
    $InviteCodeService = require('../../../utils/service/inviteCodeService');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        roleMode: -1,
        form: {}
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
        $Service.login(success => {
            console.info($Service.getRole());
            this.setData({
                ["roleMode"]: $Service.getRole(),
                ["maxRole"]: $Service.getMaxRole()
            });
            console.info(options);
        });

        this.configDeal(options).then(value => {

        }).catch(reason => {
            console.error(reason)
            $Message({
                content: reason, type: 'error'
            });
        });
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
    submitBut(e) {
        const _this = this, uiLock = $Utils.lockUI(this, 'loading.submitBut');
        console.info(e)
        let phoneEncryptedData = null,
            phoneEncryptedIv = null
        if (e.type == 'getphonenumber' && (e.detail || {errMsg: ""}).errMsg.indexOf(":ok") >= 0) {
            phoneEncryptedData = e.detail.encryptedData;
            phoneEncryptedIv = e.detail.iv;
        } else {
            uiLock.unlock()
            return;
        }
        if (!(this.data.form.pubAccUserId && this.data.form.inviteCode)) {
            $Message({
                content: "参数异常，请重新进入页面", type: 'error'
            });
            uiLock.unlock()
            return;
        }
        $InviteCodeService.useCode({
            phoneEncryptedIv,
            phoneEncryptedData,
            code: _this.data.form.inviteCode,
            userName: _this.data.form.realName,
            pubAccUserId: _this.data.form.pubAccUserId,
        })

    },
    login: function (e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true,
        });
        $UserService.checkAndCreateUser({
            name: e.detail.userInfo.nickName,
            iv: e.detail.iv,
            encryptedData: e.detail.encryptedData
        }).then(value => {
            this.setData({
                ["roleMode"]: $Service.getRole(),
                ["maxRole"]: $Service.getMaxRole()
            });
        })
    },
    configDeal(config) {
        const _this = this;
        return new Promise((resolve, reject) => {
            const wxPubAccUserId = config.my, inviteCode = config.invite;
            if (wxPubAccUserId && inviteCode) {
                _this.setData({
                    ["form.pubAccUserId"]: wxPubAccUserId,
                    ["form.inviteCode"]: inviteCode
                });
                resolve();
            } else {
                reject("参数异常，请重新进入页面");
            }
        })

    }
})