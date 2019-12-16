const $Service = require('./service');


const OPRERATOPM = {
    ADD: 0,
    MODIFY: 2,
    GET: 3,
    LIST: 4,
    GET_WORKERS: 100
}
const SERVIE = "userManger";
/**
 * 建单
 * */
const Methods = {
    newUserr: function (data, success, error) {
        $Service.post(SERVIE, [OPRERATOPM.ADD, {
            id: wx.getStorageSync("openId"),
            name: data.name,
            phone: data.phone
        }], function (res) {
            success(res)
        }, function (res) {
            error(res)
        })
    },
    getUser: function (success, error) {
        $Service.post(SERVIE, [OPRERATOPM.GET, {
            id: wx.getStorageSync("openId")
        }], function (res) {
            success(res)
        }, function (res) {
            error(res)
        })
    },
    getWorkers: function (success, error) {
        $Service.post(SERVIE, [OPRERATOPM.GET_WORKERS, {}], function (res) {
            success(res)
        }, function (res) {
            error(res)
        })
    },
    setDefaultPhoneNum(phoneNum) {
        wx.setStorageSync("defaultPhoneNum", phoneNum)
    },
    getDefaultPhoneNum() {
        return wx.getStorageSync("defaultPhoneNum")
    }
}


module.exports = Methods;