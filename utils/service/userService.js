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
            id: $Service.getUserId(),
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
            id: $Service.getUserId()
        }], function (res) {
            success(res)
        }, function (res) {
            error(res)
        })
    },
    getWorkers: function (success, error) {
        $Service.post(SERVIE, [OPRERATOPM.GET_WORKERS, {
            id: $Service.getUserId(),
        }], function (res) {
            success(res)
        }, function (res) {
            error(res)
        })
    },
    setDefaultPhoneNum(phoneNum) {
        wx.setStorageSync($Service.getKey("PHONE"), phoneNum)
    },
    getDefaultPhoneNum() {
        return wx.getStorageSync($Service.getKey("PHONE"))
    },
    setUserAttr(userAttr) {
        wx.setStorageSync($Service.getKey("USER_ATTR"), userAttr)
    },
    getUserAttr() {
        return wx.getStorageSync($Service.getKey("USER_ATTR"))
    },
    updateUser(data, success, error) {
        $Service.post(SERVIE, [OPRERATOPM.MODIFY, {
            id: $Service.getUserId(),
            name: data.name,
            phone: data.phone,
            role: data.role,
        }], function (res) {
            success(res)
        }, function (res) {
            error(res)
        })
    },
}


module.exports = Methods;