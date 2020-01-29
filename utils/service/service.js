const URLS = {
    COMMON: "www.welisdoon.xyz/wxApp",
    PIC: "https://www.welisdoon.xyz/pic"
}
const OPRERATOPM = {
    ADD: 0,
    GET: 3,
}

const KEY = {
    OPEN_ID: "openId",
    CAR_LISENCE: "carLicence",
    PHONE: "defaultPhoneNum",
    USER_ATTR: "USER_ATTR",
}

const getUserId = function () {
    return wx.getStorageSync(KEY.OPEN_ID);
}
const setUserId = function (openId) {
    wx.setStorageSync(KEY.OPEN_ID, openId);
}

const uploadFile = function (pictrues, data, complete) {
    var successPic = [];
    var failPic = [];

    function upload(pics, idx, dat) {
        if (pics[idx]) {
            wx.uploadFile({
                url: 'https://' + URLS.COMMON + "?A1=picture&A3=UP",
                filePath: pics[idx],
                name: 'file',
                formData: dat,
                success(res) {
                    successPic.push({path: pics[idx], result: res})
                },
                fail(res) {
                    failPic.push({path: pics[idx], result: res})
                },
                complete() {
                    upload(pics, ++idx, dat)
                }
            })
        } else {
            complete({
                success: successPic,
                fail: failPic,
            })
        }
    }

    upload(pictrues, 0, data)

}
const setRole = function (role) {
    return wx.setStorageSync("roleMode", role);
}
const initUserInfo = function (dat) {
    setUserId(dat.openid)
    setRole(isNaN(dat.user.role) ? -1 : dat.user.role);
    wx.setStorageSync(KEY.PHONE, dat.user.phone)
    wx.setStorageSync(KEY.USER_ATTR, dat.user.userAttr || {});
}

const clearUserInfo = function () {
    const userId = getUserId();
    wx.clearStorageSync();
    setUserId(userId)
    setRole(-1);
}
const methods = {
    getUrl: function (name) {
        return URLS[name]
    },
    post: function () {
        const datas = [];
        const func = [];
        let invailArgs = false;
        for (let i = 0; i < arguments.length; i++) {
            if (typeof (arguments[i]) == "function") {
                func.push(arguments[i])
                invailArgs = true;
            } else {
                if (!invailArgs)
                    datas.push(arguments[i])
            }
        }
        wx.request({
            url: 'https://' + URLS.COMMON + "?A1=" + datas[0] + "&A2=" + datas[1], //仅为示例，并非真实的接口地址
            data: datas[2],
            method: "POST",
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: func[0],
            fail: func[1],
            complete: func[2]
        })
    }, get: function () {
        wx.request({
            url: 'https://' + URLS.COMMON, //仅为示例，并非真实的接口地址
            data: arguments[0],
            method: "GET",
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: arguments[1],
            fail: arguments[2],
            complete: arguments[3]
        })
    }
    , login: function (success, error) {

        const getOpenId = () => {
            wx.login({
                success: function (res) {
                    if (res.code) {
                        //发起网络请求
                        methods.get({code: -1, value: res.code}, function (res1) {
                            var dat = res1.data;
                            if (dat.openid) {
                                initUserInfo(dat)
                                success(dat)
                            } else {
                                error("[" + dat.errcode + ']' + dat.errmsg);
                            }
                        })
                    } else {
                        error(res.errMsg)
                        console.log('登录失败！' + res.errMsg)
                    }
                },
                fail(res) {
                    console.log('登录失败！' + res.errMsg)
                    error("网络异常")
                }
            })
        }
        clearUserInfo()
        wx.checkSession({
            success: function () {
                //session_key 未过期，并且在本生命周期一直有效
                let openId = getUserId()
                if (!openId || !openId.trim()) {
                    //重新登录
                    getOpenId()
                } else {
                    methods.post("user", "login", [openId], res => {
                        res.data.result.openid = openId
                        initUserInfo(res.data.result)
                        success(res.data.result)
                    }, err => {
                        console.log('登录失败！' + err)
                        error("网络异常")
                    })
                }
            },
            fail: function () {
                // session_key 已经失效，需要重新执行登录流程
                //重新登录
                getOpenId()
            }
        })
    },
    getRole: function () {
        // return wx.getStorageSync("isAdmin") ? 2 : (wx.getStorageSync("isWorker")) ? 1 : 0;
        return wx.getStorageSync("roleMode");
    },
    setRole: function (role) {
        return setRole(role);
    },
    upload: function (pictrue, formData, complate) {
        if (pictrue instanceof Array) {
            uploadFile(pictrue, formData, complate)
        } else if (pictrue instanceof String) {
            uploadFile([pictrue], formData, complate)
        }
    },
    getUserInfo: function () {
        return {
            id: getUserId(),
        }
    },
    getSuccessPictureIds(picArr) {
        picArr = picArr || [];
        const pictureIds = [];
        for (let i = 0; i < picArr.length; i++) {
            pictureIds.push(JSON.parse(picArr[i].result.data).result.pictrueId);
        }
        return pictureIds
    },
    getUserId: getUserId,
    setUserId: setUserId,
    getValueFaster(obj, key) {
        const keys = key.split(".");
        let dat = obj;
        for (var idx = 0; idx < keys.length; idx++) {
            if (idx != keys.length - 1) {
                if (!dat) return null;
                dat = dat[keys[idx]]
            } else
                return dat[keys[idx]]
        }
        return null;
    },
    getKey(keyWord) {
        return KEY[keyWord];
    }
}
module.exports = methods