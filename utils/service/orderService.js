const $Service = require('./service');


const OPRERATOPM = {
    ADD: 0,
    GET: 3,
    GET_WORK_NUM: 10,
}
const SERVIE = "orderManger";
/**
 * 建单
 * */
const Methods = {
    newOrder: function (submitData, success, error) {
        $Service.post(SERVIE, [OPRERATOPM.ADD, {
            "carLicenseNumber": "2",
            "carAddress": submitData.value1,
            "createDate": new Date().valueOf(),
            "orderControlPerson": null,
            "orderAppointPerson": null,
            "orderArrangeDate": function () {
                return (!submitData.value3) ? new Date().valueOf() : new Date('2019-11-12 ' + submitData.value3 + ":00.00").valueOf();
            }(),
            "custId": wx.getStorageSync("openId"),
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
    }, getOrders: function (data, success, error) {
        $Service.post(SERVIE, [OPRERATOPM.GET, {
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
    }, getWorkBum: function (data, success, error) {
        $Service.post(SERVIE, [OPRERATOPM.GET_WORK_NUM, {
            "custId": data.custId,
        }], function (res) {
            success(res)
        }, function (res) {
            error(res)
        })
    }

}


module.exports = Methods;