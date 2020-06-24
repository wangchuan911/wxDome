const $Service = require('../core/service'),
    {OPRERATOPM} = require("../../../utils/pubConst.js"),
    SERVIE = "mall";
/**
 * 建单
 * */

const Methods = {
    getGoods(data, success, error) {
        $Service.post(SERVIE, null, [OPRERATOPM.LIST, {
            id: 0
        }], success, error)
    }
}


module.exports = Methods;