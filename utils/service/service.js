const URLS = {
    COMMON: "hubidaauto.cn/wxApp",
    PIC: "hubidaauto.cn/pic"
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
    const successPic = [];
    const failPic = [];
    const params = {
        A1: "picture",
        A3: "UP",
    }

    function upload(pics, idx, dat) {
        if (pics[idx]) {
            wx.uploadFile({
                url: 'https://' + URLS.COMMON + createPathParams(params),//"?A1=picture&A3=UP",
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
const setMaxRole = function (role) {
    return wx.setStorageSync("maxRoleMode", role);
}
const getMaxRole = function (role) {
    return wx.getStorageSync("maxRoleMode");
}
const initUserInfo = function (dat) {
    setUserId(dat.openid)
    setRole(isNaN(dat.user.role) ? -1 : dat.user.role);
    setMaxRole(isNaN(dat.user.maxRole) ? -1 : dat.user.maxRole)
    wx.setStorageSync(KEY.PHONE, dat.user.phone)
    wx.setStorageSync(KEY.USER_ATTR, dat.user.userAttr || {});
}

const clearUserInfo = function () {
    const userId = getUserId();
    wx.clearStorageSync();
    setUserId(userId)
    setRole(-1);
    setMaxRole(-1);
}
const createPathParams = function (data) {
    let path = "";
    for (let key in data) {
        path += '&' + key + "=" + data[key];
    }
    return path.length == 0 ? path : "?" + path.substring(1);
}
const isFunction = function (fn) {
    return (typeof (fn) == 'function');
}
const methods = {
    getUrl: function (name) {
        return URLS[name]
    },
    post: function () {
        const datas = [];
        const func = [];
        for (let i = 0; i < arguments.length; i++) {
            if (typeof (arguments[i]) == "function") {
                func.push(arguments[i]);
            } else {
                datas.push(arguments[i])
            }
        }
        const params = {
            A1: datas[0],
            A2: datas[1],
        }
        const option = datas[3] || {};
        const header = (option.header || {});
        header['content-type'] = 'application/json' // 默认值
        //分页
        if (option.page) {
            params.page = option.page.index + "," + option.page.size
        }

        wx.request({
            url: 'https://' + URLS.COMMON + createPathParams(params), //仅为示例，并非真实的接口地址
            data: datas[2],
            method: "POST",
            header: header,
            success: (value) => {
                const data = value.data
                if (data.error || data.exception) {
                    if (isFunction(func[1])) {
                        func[1](value)
                    } else {
                        wx.showToast({
                            title: '服务异常请重试！',
                            icon: 'none',
                            duration: 2000,
                            mask: true,
                        })
                    }
                } else if (func[0]) {
                    func[0](value);
                }
            },
            fail: function (res) {
                func[1](res)
            },
            complete: func[2]
        })
    }, get: function () {
        const datas = [];
        const func = [];
        for (let i = 0; i < arguments.length; i++) {
            if (typeof (arguments[i]) == "function") {
                func.push(arguments[i]);
            } else {
                datas.push(arguments[i])
            }
        }
        const option = datas[1] || {};
        const header = (option.header || {});
        header['content-type'] = 'application/json' // 默认值
        wx.request({
            url: 'https://' + URLS.COMMON, //仅为示例，并非真实的接口地址
            data: datas[0],
            method: "GET",
            header: header,
            success: (value) => {
                const data = value.data
                if (data.error || data.exception) {
                    if (isFunction(func[1])) {
                        func[1](value)
                    } else {
                        wx.showToast({
                            title: '服务异常请重试！',
                            icon: 'none',
                            duration: 2000,
                            mask: true,
                        })
                    }
                } else if (func[0]) {
                    func[0](value);
                }
            },
            fail: func[1],
            complete: func[2]
        })
    }
    , login: function (success, error) {

        const getOpenId = () => {
            wx.login({
                success: function (res) {
                    if (res.code) {
                        //发起网络请求
                        methods.get({B1: -1, B2: res.code}, (res1) => {
                            let dat = res1.data;
                            if (dat.openid) {
                                initUserInfo(dat)
                                success(dat)
                            } else {
                                error("[" + dat.errcode + ']' + dat.errmsg);
                            }
                        }, res1 => {
                            error(res1)
                            console.log('登录失败！' + res1)
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
    getMaxRole: getMaxRole,
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
        for (let idx = 0; idx < keys.length; idx++) {
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
    },
    setPageState(page, value) {
        const pages = wx.getStorageSync("pages") || {};
        pages[page] = value;
        wx.setStorageSync("pages", pages)
    },
    pullPageState(page) {
        const pages = wx.getStorageSync("pages") || {};
        const value = pages[page];
        delete pages[page]
        wx.setStorageSync("pages", pages);
        return value
    },
    getPageState(page) {
        return (wx.getStorageSync("pages") || {})[page];
    },
    toWebPage(data) {
        wx.navigateTo({
            url: "/pages/index2/web/web",
            success: function (res) {
                res.eventChannel.emit('acceptDataFromOpenerPage', data)
            },
        })
    },
    freshMarkers(markers, orderPositions) {
        markers.splice(1, markers.length - 1);
        (orderPositions || []).forEach(value => {
            markers.push({
                //iconPath: "/resources/others.png",
                id: 0,
                latitude: value.pos_x,
                longitude: value.pos_y,
                width: 50,
                height: 50,
                callout: {
                    //color: "red",
                    content: value.order_code,
                    fontSize: 20,
                    borderWidth: 2,
                    padding: 10,
                    borderRadius: 20,
                    textAlign: "center"
                }
            });
        })
        return markers;
    },
    doOtherThings(options) {
        if (!options) return false;
        const getParams = (params) => {
            return Object.keys(params).filter(value => value != 'code').map(value => value + '=' + params[value]).join("&");
        }
        switch (options.code) {
            case "joinUs": {
                wx.redirectTo({
                    url: '/pages/customer/register/register?' + getParams(options)
                });
                return true;
            }
            default:
                return false;
        }
    }
}
module.exports = methods