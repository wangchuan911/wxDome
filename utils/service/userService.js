const $Service = require('./service');


const OPRERATOPM = {
    ADD: 0,
    MODIFY: 2,
    GET: 3,
    LIST: 4,
    GET_WORKERS: 100,
    AREA_RANGE: 101,
}
const SERVIE = "user";
/**
 * 建单
 * */
const Methods = {
    newUserr: function (data, success, error) {
        $Service.post(SERVIE, null, [OPRERATOPM.MODIFY, {
            id: $Service.getUserId(),
            name: data.name,
            phone: data.phone,
            role: 0,
        }], function (res) {
            success(res)
        }, function (res) {
            error(res)
        })
    },
    getUser: function (success, error) {
        $Service.post(SERVIE, null, [OPRERATOPM.GET, {
            id: $Service.getUserId()
        }], function (res) {
            success(res)
        }, function (res) {
            error(res)
        })
    },
    getWorkers: function (success, error) {
        $Service.post(SERVIE, null, [OPRERATOPM.GET_WORKERS, {
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
        $Service.post(SERVIE, null, [OPRERATOPM.MODIFY, {
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
    getWorkAreaRange(data, success, error) {
        $Service.post(SERVIE, null, [OPRERATOPM.AREA_RANGE, data], function (res) {
            success(res)
        }, function (res) {
            error(res)
        })
    }
}


module.exports = Methods;