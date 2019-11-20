const URLS = {
    COMMON: "www.welisdoon.xyz/wxApp",
    UPLOAD: "www.welisdoon.xyz/imgUpd",
}
const OPRERATOPM = {
    ADD: 0,
    GET: 3,
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
const initUserInfo = function (dat) {
    wx.setStorageSync("openId", dat.openid)
    wx.removeStorageSync("isWorker");
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
    }
    wx.setStorageSync("roleMode", dat.user.role || 0)
}
const methods = {
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

        function getOpenId() {
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

        wx.setStorageSync("roleMode", 0);
        wx.checkSession({
            success: function () {
                //session_key 未过期，并且在本生命周期一直有效
                let openId = wx.getStorageSync("openId")
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
        return wx.getStorageSync("isAdmin") ? 2 : (wx.getStorageSync("isWorker")) ? 1 : 0;
    },
    upload: function (pictrue, formData, complate) {
        if (pictrue instanceof Array) {
            uploadFile(pictrue, formData, complate)
        } else if (pictrue instanceof String) {
            uploadFile([pictrue], formData, complate)
        }
    }
}
module.exports = methods