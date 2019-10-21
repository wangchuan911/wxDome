const URLS = {
    COMMON: "www.welisdoon.xyz/wxApp",

}
var post = function () {
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
}


module.exports = {
    post: post
}