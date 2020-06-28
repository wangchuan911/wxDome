const $Service = require('./service');
const $Utils = require('../../util');
const $PubConst = require('../../pubConst');


const OPRERATOPM = {
    DELETE: 1,
    ADD: 0,
    GET: 3,
    LIST: 4,
    GET_WORK_NUM: 100,
    APPIONT_WORKER: 101,
}
const SERVIE = "order";
/**
 * 建单
 * */
const Methods = {
    newOrder: function (submitData, extra, success, error) {
        $Service.post(SERVIE, null, [OPRERATOPM.ADD, {
            "carLicenseNumber": wx.getStorageSync("carLicence"),
            "carAddress": submitData.value1,
            "createDate": new Date().valueOf(),
            "orderControlPerson": null,
            "orderAppointPerson": null,
            "orderArrangeDate": function () {
                return (!submitData.value3) ? new Date().valueOf() : $Utils.getPickerDate(submitData.value3).valueOf();
            }(),
            "custId": wx.getStorageSync("openId"),
            "passTache": function () {
                var passTache = "";
                /*if (submitData.value6.washOut) passTache += ",1"
                if (submitData.value6.washIn) passTache += ",2"*/

                /*for (var index in submitData.value6) {
                    if (!submitData.value6[index]) {
                        const val = $PubConst.optionTaches.find(value => value.id == index);
                        if (val.tacheId) {
                            passTache += ',' + val.tacheId
                        }
                    }
                }
                return passTache.substr(1);*/
                const selectTaches = Object.keys(submitData.value6)
                    .filter(value => submitData.value6[value])
                    .map(value => $PubConst
                        .optionTaches
                        .find(value1 => value1.id == value)
                        .tacheId
                        .join(","))
                    .join(",")
                    .split(",")
                const aLLSelectTaches = $PubConst.optionTaches
                    .map(value => value.tacheId.join(","))
                    .join(",")
                    .split(",");
                console.info(selectTaches)
                console.info(aLLSelectTaches)
                passTache = aLLSelectTaches.filter(all => selectTaches.indexOf(all) < 0).join(",");
                console.info(passTache)
                return passTache;
            }(),
            "orderNote": (submitData.value2 || {}).value1,
            "posX": submitData.value7.latitude,
            "posY": submitData.value7.longitude,
            "orderCode": submitData.value8,
            "regionCode": submitData.value9,
            "pictureIds": submitData.value2.pictureIds,
            "cost": submitData.value10 * 100,
            "phoneEncryptedData": extra.phoneEncryptedData,
            "phoneEncryptedIv": extra.phoneEncryptedIv,
            "couponId": extra.couponId,
        }], function (res) {
            success(res)
        }, function (res) {
            error(res)
        })
    }, getOrders: function (data, success, error) {
        $Service.post(SERVIE, null, [OPRERATOPM.LIST, {
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
            "orderState": data.orderState,
        }], {page: data.page}, function (res) {
            success(res)
        }, function (res) {
            error(res)
        })
    }, getWorkBum: function (data, success, error) {
        const key = $Service.getRole() == 1 ? "orderAppointPerson" : $Service.getRole() == 2 ? "orderControlPerson" : null;
        if (key == null) {
            error()
            return;
        }
        $Service.post(SERVIE, null, [OPRERATOPM.GET_WORK_NUM, {
            [key]: $Service.getUserId(),
        }], function (res) {
            success(res)
        }, function (res) {
            error(res)
        })
    }, selectWorker: function (data, success, error) {
        $Service.post(SERVIE, null, [OPRERATOPM.APPIONT_WORKER, {
            "orderId": data.orderId,
            "orderControlPerson": $Service.getUserId(),
            "orderAppointPerson": data.orderControlPerson,
        }], function (res) {
            success(res)
        }, function (res) {
            error(res)
        })
    }, getOrder: function (data, success, error, complete) {
        $Service.post(SERVIE, null, [OPRERATOPM.GET, {
            "orderId": data.orderId,
            "custId": $Service.getUserId()
        }], success, error, complete)
    }, modelChange: function (data) {//模型转换
        const object = {
            orderId: data.orderId,
            orderTime: $Utils.formatTime(new Date(data.createDate)),
            addr: data.carAddress,
            endTime: data.finishDate != null ? $Utils.formatTime(new Date(data.finishDate)) : "",
            vip: data.custLevel ? data.custLevel : "",
            preDate: data.orderArrangeDate ? $Utils.formatTime(new Date(data.orderArrangeDate)) : "",
            carNo: data.carLicenseNumber,
            carType: (data.carVO || {}).brand || '',
            carColor: (data.carVO || {}).color || '',
            latitude: data.posX,
            longitude: data.posY,
            isDeal: data.orderAppointPerson != null,
            orderCode: data.orderCode,
            worker: data.orderAppointPersonName,
            workerPhone: data.orderAppointPhone,
            custName: data.custName,
            custPhone: data.custPhone,
            custId: data.custId,
            cost: data.cost,
            orderNote: data.orderNote,
            serverType: ((res) => {
                return Array.from(new Set($PubConst.optionTaches
                    .map(value => value.tacheId.join(","))
                    .join(",")
                    .split(",")))
                    .filter(value => res.indexOf(value) < 0)
                    .map(value => $PubConst.customer.stepMap[value].tacheName).join(",");
            })(data.passTache ? data.passTache.split(',') : []) || ""
        };
        /*if (data.pictureVOS || [] > 0) {
            let pic;
            for (let idx in data.pictureVOS) {
                pic = data.pictureVOS[idx];
                let picId = function () {
                    const step = $PubConst.customer.step1.find(value => {
                        if (pic.tacheId == value.id) {
                            return true;
                        } else {
                            return value.subTaches.indexOf(pic.tacheId) >= 0;
                        }
                    });
                    return (step || {}).id || pic.tacheId;
                }();
                let names = object["imgs" + picId] || [];
                object["imgs" + picId] = names;
                names.push("https://" + $Service.getUrl("PIC") + "/" + pic.name);
            }
        }*/
        (data.pictureVOS || []).forEach(pic => {
            let picId = ($PubConst.customer.step1.find(value =>
                //找到当前主环节，或子环节的图片
                (pic.tacheId == value.id) ? true : value.subTaches.indexOf(pic.tacheId) >= 0
            ) || {}).id || pic.tacheId;
            const pKey = "imgs" + picId;
            (object[pKey] = (object[pKey] == null) ? [] : object[pKey])
                .push("https://" + $Service.getUrl("PIC") + "/" + pic.name);
        })
        const state = $PubConst.customer.step1.find(value => value.id == data.tacheId) || {};
        object.stateId = data.tacheId;
        object.state = state.state;
        object.code = state.code;
        return object
    }, closeOrders: function (data, success, error) {
        $Service.post(SERVIE, null, [OPRERATOPM.DELETE, {
            "custId": $Service.getUserId(),
            "orderId": data.orderId
        }], function (res) {
            success(res)
        }, function (res) {
            error(res)
        })
    }

}


module.exports = Methods;