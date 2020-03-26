const $Service = require('./service');

const WASH_MAIN_TAMPLATE = 1;
const OPRERATOPM = {
    GET: 3,
    LIST: 4,
}
const SERVIE = "operation";
/**
 * 建单
 * */
const Methods = {
    getOrderOperation: function (data, success, error, complete) {
        $Service.post(SERVIE, null, [OPRERATOPM.LIST, {
            "orderId": data.orderId,
            "oprMan": wx.getStorageSync("openId"),
            "active": true,
        }], success, error, complete)
    },
    toBeContinue: function (data, success, error, complete) {
        $Service.post(SERVIE, "toBeContinue", [{
            "orderId": data.orderId,
            "userId": wx.getStorageSync("openId"),
            "tacheId": data.tacheId,
            "doNext": data.doNext,
            "info": data.info,
        }], success, error, complete)
    },

}


module.exports = Methods;