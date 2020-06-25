const $Service = require('../core/service'),
    {OPRERATOPM} = require("../../../utils/pubConst.js"),
    $PayService = require('../../../utils/service/core/payService'),
    SERVIE = "mall";
/**
 * 建单
 * */

const Methods = {
    getGoods(data, success, error) {
        $Service.post(SERVIE, null, [OPRERATOPM.LIST, {
            id: 0
        }], success, error)
    },
    mallPay(data, success, error) {
        $PayService.mallPay({id: data.id, num: data.num, custId: $Service.getUserId()}, success, error)
    }
}


module.exports = Methods;