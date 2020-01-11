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
                return (!submitData.value3) ? new Date().valueOf() :$Utils.getPickerDate(submitData.value3).valueOf();
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
            "posY": submitData.value7.longitude,
            "orderCode": submitData.value8,
            "regionCode": submitData.value9,
            "pictureIds": submitData.value2.pictureIds
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
            "orderNote": data.orderNote,
            "regionCode": data.regionCode,
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
            carType: data.carVO.brand || '',
            carColor: data.carVO.color || '',
            latitude: data.posX,
            longitude: data.posY,
            isDeal: data.orderAppointPerson != null,
            orderCode: data.orderCode,
            worker: data.orderAppointPersonName,
            workerPhone: data.orderAppointPhone,
            custName: data.custName,
            custPhone: data.custPhone,
        }
        if (data.pictureVOS || [] > 0) {
            let pic;
            for (let idx in data.pictureVOS) {
                pic = data.pictureVOS[idx];
                let names = object["imgs" + pic.tacheId]
                if (!names) {
                    names = [];
                    object["imgs" + pic.tacheId] = names;
                }
                names.push($Service.getUrl("PIC") + "/" + pic.name);
            }
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