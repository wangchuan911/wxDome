const $Service = require('./service');


const OPRERATOPM = {
    ADD: 0,
    MODIFY: 2,
    GET: 3,
    LIST: 4,
    GET_WORK_NUM: 10,
}
const SERVIE = "carManger";
/**
 * 建单
 * */
const Methods = {
    addCar: function (data, success, error) {
        $Service.post(SERVIE, [OPRERATOPM.ADD, {
            userId: wx.getStorageSync("openId"),
            brand: data.brand,
            lisence: data.lisence,
            color: data.color,
            modal: data.modal,
            defaultSelected: data.defaultSelected,
        }], function (res) {
            success(res)
        }, function (res) {
            error(res)
        })
    },
    getCars: function (data, success, error) {
        $Service.post(SERVIE, [OPRERATOPM.LIST, {
            userId: wx.getStorageSync("openId"),
            brand: data.brand,
            lisence: data.lisence,
            color: data.color,
            modal: data.modal,
        }], function (res) {
            success(res)
        }, function (res) {
            error(res)
        })
    },
    setDefault: function (data, success, error) {
        $Service.post(SERVIE, [OPRERATOPM.MODIFY, {
            userId: wx.getStorageSync("openId"),
            lisence: data.lisence,
        }], function (res) {
            success(res)
        }, function (res) {
            error(res)
        })
    },
}


module.exports = Methods;