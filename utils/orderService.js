const $Service = require('./service');


const OPRERATOPM = {
    ADD: 0,
    GET: 3,
}

/**
 * 建单
 * */
var newOrder = function (submitData, success, error) {
    $Service.post("orderManger", [OPRERATOPM.ADD, {
        "carLicenseNumber": "2",
        "carAddress": submitData.value1,
        "createDate": new Date().valueOf(),
        "orderControlPerson": null,
        "orderAppointPerson": null,
        "orderArrangeDate": function () {
            return (!submitData.value3) ? null : new Data('2019-11-12 ' + submitData.value3 + ":00.00").valueOf();
        }(),
        "custId": 4,
        "serviceId": function () {
            var serviceId = ""
            if (submitData.value6.washOut) serviceId += ",1"
            if (submitData.value6.washIn) serviceId += ",2"
            return serviceId.substr(1);
        }(),
        "orderNote": (submitData.value2 || {}).value1,
        "posX": submitData.value7.latitude,
        "posY": submitData.value7.longitude
    }], function (res) {
        success(res)
    }, function (res) {
        error(res)
    })
}
var getOrders = function (data, success, error) {
    $Service.post("orderManger", [OPRERATOPM.GET, {
        "carLicenseNumber": data.carLicenseNumber,
        "carAddress": data.carAddress,
        "createDate": data.createDate,
        "orderControlPerson": data.orderControlPerson,
        "orderAppointPerson": data.orderAppointPerson,
        "orderArrangeDate": data.orderArrangeDate,
        "custId": data.custId,
        "serviceId": data.serviceId,
        "orderNote": data.orderNote
    }], function (res) {
        success(res)
    }, function (res) {
        error(res)
    })
}
var login = function () {
    wx.login({
        success: function (res) {
            if (res.code) {
                //发起网络请求
                post(0, {}, function (res) {
                    console.info(JSON.stringify(res))
                })
            } else {
                console.log('登录失败！' + res.errMsg)
            }
        }
    })
}


module.exports = {
    newOrder: newOrder,
    getOrders: getOrders,
}