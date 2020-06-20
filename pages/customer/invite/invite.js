// pages/customer/invite/invite.js
const $InviteCodeService = require('../../../utils/service/inviteCodeService'),
    //$UserService = require('../../../utils/service/userService'),
    $Utils = require('../../../utils/util'),
    {$Message} = require('../../../ui/iview/base/index');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        inviteType: {
            types: $InviteCodeService.TYPES,
            current: $InviteCodeService.TYPES[0].name,
        },
        inviteModal: {
            visible: false,
            inviteCode: null,
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },
    inviteTypeChange({detail = {}}) {
        this.setData({
            ["inviteType.current"]: detail.value
        });
    },
    submitBut() {
        const _this = this, uiLock = $Utils.lockUI(this, 'loading.submitBut');
        $InviteCodeService.addCode({
            type: _this.data.inviteType.types.find(value => value.name == _this.data.inviteType.current).id
        }, success => {
            let code = ((res) => $InviteCodeService.CODE_PREFIX[res.type] + res.code)(success.data.result);
            if (code) {
                _this.setData({
                    ["inviteModal.visible"]: true,
                    ["inviteModal.inviteCode"]: code
                });
            } else {
                $Message({
                    content: "生成失败"
                });
            }
            uiLock.unlock();
        }, fail => {
            uiLock.unlock();
        })
    },
    inviteCodeOkBut() {
        const _this = this;
        _this.setData({
            ["inviteModal.visible"]: false,
        })
    },
    copyBut() {
        const _this = this;
        wx.setClipboardData({
            data: _this.data.inviteModal.inviteCode,
            success(res) {

            }, fail(res) {
                $Message({
                    content: "复制失败"
                });
                console.info(res)
            }
        })
    }
})