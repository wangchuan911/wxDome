const URLS = {
    COMMON: "www.welisdoon.xyz/wxApp",
    UPLOAD: "www.welisdoon.xyz/imgUpd",
    PIC: "https://www.welisdoon.xyz/pic"
}
const OPRERATOPM = {
    ADD: 0,
    GET: 3,
}
const getUserId = function () {
    return wx.getStorageSync("openId");
}
const setUserId = function (openId) {
    wx.setStorageSync("openId", openId);
}

const uploadFile = function (pictrues, data, complete) {
    var successPic = [];
    var failPic = [];

    function upload(pics, idx, dat) {
        if (pics[idx]) {
            wx.uploadFile({
                url: 'https://' + URLS.UPLOAD,
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
    /*wx.removeStorageSync("isWorker");
    wx.removeStorageSync("isAdmin");
    wx.removeStorageSync("newUser");
    switch (dat.user.role || 0) {
        case 0:
            break;
        case 1:
            wx.setStorageSync("isWorker", true);
            break;
        case 2:
            wx.setStorageSync("isAdmin", true);
            break;
        case -1:
            wx.setStorageSync("newUser", true);
            dat.user.role = 0;
            break;
    }*/
    setRole(isNaN(dat.user.role) ? -1 : dat.user.role);
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
            url: 'https://' + URLS.COMMON, //仅为示例，并非真实的接口地址
            data: datas,
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
                }
            })
        }

        setRole(-1);
        wx.checkSession({
            success: function () {
                //session_key 未过期，并且在本生命周期一直有效
                let openId = getUserId()
                if (!openId || !openId.trim()) {
                    //重新登录
                    getOpenId()
                } else {
                    methods.post("login", [openId], function (res) {
                        res.data.result.openid = openId
                        initUserInfo(res.data.result)
                        success(res.data.result)
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
    setUserId: setUserId
}
module.exports = methods