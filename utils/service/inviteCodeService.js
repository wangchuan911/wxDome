const $Service = require('./service');


const OPRERATOPM = {
    ADD: 0,
    DELETE: 1,
    GET: 3,
    LIST: 4,
}
const SERVIE = "inviteCode";
/**
 * 建单
 * */

const Methods = {
    addCode: function (data, success, error) {
        $Service.post(SERVIE, null, [OPRERATOPM.ADD, {
            userId: wx.getStorageSync("openId"),
            type: data.type
        }], function (res) {
            success(res)
        }, function (res) {
            error(res)
        })
    },
}


module.exports = Methods;