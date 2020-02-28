const $Service = require('./service');


const OPRERATOPM = {
    ADD: 0,
    DELETE: 1,
    MODIFY: 2,
    GET: 3,
    LIST: 4,
    GET_MODAL: 100
}
const SERVIE = "car";
/**
 * 建单
 * */
const carLisenceKey = $Service.getKey("CAR_LISENCE");
const getDefaultCarNo = function () {
    return wx.getStorageSync(carLisenceKey)
}
const setDefaultCarNo = function (carNo) {
    wx.setStorageSync(carLisenceKey, carNo)
}
const Methods = {
    addCar: function (data, success, error) {
        $Service.post(SERVIE, null, [OPRERATOPM.ADD, {
            userId: wx.getStorageSync("openId"),
            brand: data.brand,
            lisence: data.lisence,
            color: data.color,
            modal: data.modal,
            defaultSelected: data.defaultSelected,
            phone: data.phone,
            carModelId:data.carModelId
        }], function (res) {
            success(res)
        }, function (res) {
            error(res)
        })
    },
    getCars: function (data, success, error) {
        $Service.post(SERVIE, null, [OPRERATOPM.LIST, {
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
        $Service.post(SERVIE, null, [OPRERATOPM.MODIFY, {
            userId: wx.getStorageSync("openId"),
            lisence: data.lisence,
        }], function (res) {
            success(res)
        }, function (res) {
            error(res)
        })
    },
    delCar: function (data, success, error) {
        $Service.post(SERVIE, null, [OPRERATOPM.DELETE, {
            userId: wx.getStorageSync("openId"),
            lisence: data.lisence,
        }], function (res) {
            success(res)
        }, function (res) {
            error(res)
        })
    },
    getDefaultCarNo: getDefaultCarNo,
    setDefaultCarNo: setDefaultCarNo,
    getModel: function (data, success, error) {
        $Service.post(SERVIE, null, [OPRERATOPM.GET_MODAL, {
            level: data.level,
            carBrand: data.carBrand,
        }], function (res) {
            success(res)
        }, function (res) {
            error(res)
        })
    },
}


module.exports = Methods;