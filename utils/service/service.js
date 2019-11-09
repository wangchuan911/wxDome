const URLS = {
    COMMON: "www.welisdoon.xyz/wxApp",
}
const OPRERATOPM = {
    ADD: 0,
    GET: 3,
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
                                wx.setStorageSync("openId", dat.openid)
                                switch (dat.user.role || 0) {
                                    case 0:
                                        break;
                                    case 1:
                                        wx.setStorageSync("isAdmin", true);
                                        break;
                                    case 2:
                                        wx.setStorageSync("isWorker", true);
                                        break;
                                }
                                wx.setStorageSync("roleMode", dat.user.role || 0)
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
    }
}
module.exports = methods