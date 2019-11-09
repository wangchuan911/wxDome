const $Service = require('./service');

const WASH_MAIN_TAMPLATE = 1;
const OPRERATOPM = {
    GET: 3,
    LIST: 4,
}
const SERVIE = "operationManager";
/**
 * 建单
 * */
const Methods = {
    getOrderOperation: function (data, success, error) {
        $Service.post(SERVIE, [OPRERATOPM.LIST, {
            "orderId": data.orderId,
            "oprMan": wx.getStorageSync("openId"),
        }], success, error)
    },

}


module.exports = Methods;