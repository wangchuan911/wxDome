const $Service = require('./service');


const OPRERATOPM = {
    ADD: 0,
    MODIFY: 2,
    GET: 3,
    LIST: 4,
    GET_WORKERS: 100,
    AREA_RANGE: 101,
    LOCAL: 1
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
            useriv: data.iv,
            userEncryptedData: data.encryptedData,
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
    getWorkers: function (data, success, error) {
        $Service.post(SERVIE, null, [OPRERATOPM.GET_WORKERS, {
            orderId: data.orderId,
            orderControlPerson: $Service.getUserId()
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
    },
    checkAndCreateUser(userInfo) {
        return new Promise((resolve, reject) => {
            if ($Service.getRole() < 0) {
                this.newUserr({
                    name: userInfo.name,
                    iv: userInfo.iv,
                    encryptedData: userInfo.encryptedData
                }, res => {
                    $Service.setRole(0);
                    resolve({code: "NEW_USER"})
                }, res => {
                    reject()
                })
            } else {
                resolve({})
            }
        })
    },
    workerPositionUpdate() {
        if ($Service.getRole() != 1) return;
        wx.startLocationUpdateBackground({
            success: (res) => {
                wx.offLocationChange(res => {
                    console.info(res);
                });
                let isOn = false;
                const fn = res => {
                    if (isOn) return;
                    isOn = true;
                    console.info(res);
                    wx.offLocationChange();
                    wx.onLocationChange(res => {
                        wx.offLocationChange();
                        console.info(res)
                        isOn = false;
                        $Service.post("userOperRecord", null, [OPRERATOPM.LOCAL, {
                            id: $Service.getUserId(),
                            workerStatus: {
                                posX: res.latitude,
                                posY: res.longitude,
                            },
                        }], (res) => {

                        }, (res) => {

                        })
                    });
                };
                setInterval(fn, 10 * 60 * 1000);
                fn();
            },
            fail: (res) => {
                console.info(res)
            },
        });
    }
}


module.exports = Methods;