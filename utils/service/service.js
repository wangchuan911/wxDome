const URLS = {
    COMMON: "www.welisdoon.xyz/wxApp",
}
const OPRERATOPM = {
    ADD: 0,
    GET: 3,
}
const methods = {
    post: function () {
        var datas = [];
        var func = [];
        for (let i = 0; i < arguments.length; i++) {
            if (typeof (arguments[i]) == "function") {
                func.push(arguments[i])
            } else {
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
            fail: func[1]
        })
    }, get: function (datas, seccess, error) {
        wx.request({
            url: 'https://' + URLS.COMMON, //仅为示例，并非真实的接口地址
            data: datas,
            method: "GET",
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: seccess,
            fail: error
        })
    }
    , login: function (success, error) {
        function getOpenId() {
            wx.login({
                success: function (res) {
                    if (res.code) {
                        //发起网络请求
                        methods.get({code: -1, value: res.code}, function (res1) {
                            if (res1.data.openid) {
                                wx.setStorageSync("openId", res1.data.openid)
                                success(res1.data.openid)
                            } else {
                                error("[" + res1.data.errcode + ']' + res1.data.errmsg);
                            }
                        })
                    } else {
                        error(res.errMsg)
                        console.log('登录失败！' + res.errMsg)
                    }
                }
            })
        }

        wx.checkSession({
            success: function () {
                //session_key 未过期，并且在本生命周期一直有效
                let openId = wx.getStorageSync("openId")
                if (!openId || !openId.trim()) {
                    //重新登录
                    getOpenId()
                } else {
                    success(openId)
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
    }
}
module.exports = methods