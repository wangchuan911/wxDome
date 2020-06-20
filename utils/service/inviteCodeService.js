const $Service = require('./service');


const OPRERATOPM = {
        ADD: 0,
        DELETE: 1,
        GET: 3,
        LIST: 4,
    },
    SERVIE = "inviteCode",
    CODE_PREFIX = {W: "JOINUS@", V: "VIP@"},
    TYPES = [{
        id: "W",
        name: '服务人员',
    }, {
        id: "V",
        name: 'VIP客户'
    }];
/**
 * 建单
 * */

const Methods = {
    addCode: function (data, success, error) {
        $Service.post(SERVIE, null, [OPRERATOPM.ADD, {
            userId: $Service.getUserId(),
            type: data.type
        }], function (res) {
            success(res)
        }, function (res) {
            error(res)
        })
    },
    TYPES,
    CODE_PREFIX
}


module.exports = Methods;