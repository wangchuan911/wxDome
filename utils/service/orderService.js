const $Service = require('./service');
const $Utils = require('../util');
const $PubConst = require('../pubConst');


const OPRERATOPM = {
    ADD: 0,
    GET: 3,
    LIST: 4,
    GET_WORK_NUM: 100,
    APPIONT_WORKER: 101,
}
const SERVIE = "orderManger";
/**
 * 建单
 * */
const Methods = {
    newOrder: function (submitData, success, error) {
        $Service.post(SERVIE, [OPRERATOPM.ADD, {
            "carLicenseNumber": wx.getStorageSync("carLicence"),
            "carAddress": submitData.value1,
            "createDate": new Date().valueOf(),
            "orderControlPerson": null,
            "orderAppointPerson": null,
            "orderArrangeDate": function () {
                return (!submitData.value3) ? new Date().valueOf() : new Date('2019-11-12 ' + submitData.value3 + ":00.00").valueOf();
            }(),
            "custId": wx.getStorageSync("openId"),
            "passTache": function () {
                var passTache = "";
                /*if (submitData.value6.washOut) passTache += ",1"
                if (submitData.value6.washIn) passTache += ",2"*/

                for (var index in submitData.value6) {
                    if (!submitData.value6[index]) {
                        const val = $PubConst.optionTaches.find(value => value.id == index);
                        if (val.tacheId) {
                            passTache += ',' + val.tacheId
                        }
                    }
                }
                return passTache.substr(1);
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
        $Service.post(SERVIE, [OPRERATOPM.LIST, {
            "carLicenseNumber": data.carLicenseNumber,
            "carAddress": data.carAddress,
            "createDate": data.createDate,
            "orderControlPerson": data.orderControlPerson,
            "orderAppointPerson": data.orderAppointPerson,
            "orderArrangeDate": data.orderArrangeDate,
            "custId": data.custId,
            "passTache": data.passTache,
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
    }, selectWorker: function (data, success, error) {
        $Service.post(SERVIE, [OPRERATOPM.APPIONT_WORKER, {
            "orderId": data.orderId,
            "orderControlPerson": wx.getStorageSync("openId"),
            "orderAppointPerson": data.orderControlPerson,
        }], function (res) {
            success(res)
        }, function (res) {
            error(res)
        })
    }, getOrder: function (data, success, error) {
        $Service.post(SERVIE, [OPRERATOPM.GET, {
            "orderId": data.orderId,
            "custId": wx.getStorageSync("openId"),
        }], function (res) {
            success(res)
        }, function (res) {
            error(res)
        })
    }, modelChange: function (data) {//模型转换
        const object = {
            orderId: data.orderId,
            orderTime: $Utils.formatTime(new Date(data.createDate)),
            addr: data.carAddress,
            endTime: data.finishDate != null ? $Utils.formatTime(new Date(data.finishDate)) : "",
            vip: data.custLevel ? data.custLevel : "",
            preDate: data.orderArrangeDate ? $Utils.formatTime(new Date(data.orderArrangeDate)) : "",
            carNo: data.carLicenseNumber,
            carType: "xxx",
            carColor: "xxxxx",
            latitude: data.posX,
            longitude: data.posY,
            isDeal: data.orderControlPerson != null,
            imgs0: [
                'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
                'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
                'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
            ]
        }
        const state = $PubConst.customer.step1.find(value => {
            return value.id == data.tacheId
        })
        object.stateId = data.tacheId;
        object.state = state.state;
        object.code = state.code;
        return object
    }

}


module.exports = Methods;