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
const getDefaultCarNo = () => {
    return (wx.getStorageSync(carLisenceKey) || {}).carNo
};
const getDefaultCarType = () => {
    return (wx.getStorageSync(carLisenceKey) || {}).carType
}
const setDefaultCarData = function (carData) {
    console.info("carData:" + JSON.stringify(carData))
    wx.setStorageSync(carLisenceKey, carData)
}
const Methods = {
    addCar(data, success, error) {
        $Service.post(SERVIE, null, [OPRERATOPM.ADD, {
            userId: wx.getStorageSync("openId"),
            brand: data.brand,
            lisence: data.lisence,
            color: data.color,
            modal: data.modal,
            defaultSelected: data.defaultSelected,
            phone: data.phone,
            carModelId: data.carModelId
        }], function (res) {
            success(res)
        }, function (res) {
            error(res)
        })
    },
    getCars(data, success, error) {
        $Service.post(SERVIE, null, [OPRERATOPM.LIST, {
            userId: $Service.getUserId(),
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
    setDefault(data, success, error) {
        $Service.post(SERVIE, null, [OPRERATOPM.MODIFY, {
            userId: $Service.getUserId(),
            lisence: data.lisence,
        }], function (res) {
            success(res)
        }, function (res) {
            error(res)
        })
    },
    delCar(data, success, error) {
        $Service.post(SERVIE, null, [OPRERATOPM.DELETE, {
            userId: $Service.getUserId(),
            lisence: data.lisence,
        }], function (res) {
            success(res)
        }, function (res) {
            error(res)
        })
    },
    getDefaultCarNo,
    setDefaultCarData,
    getDefaultCarType,
    getModel(data, success, error) {
        $Service.post(SERVIE, null, [OPRERATOPM.GET_MODAL, {
            level: data.level,
            carBrand: data.carBrand,
        }], function (res) {
            success(res)
        }, function (res) {
            error(res)
        })
    },
    modalChange(data) {
        return {
            carBrand: data.brand,
            carNo: data.lisence,
            carColor: data.color,
            carType: data.modal,
            carModelId: data.carModelId,
        }
    }
}


module.exports = Methods;