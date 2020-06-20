const $Service = require('./service');


const OPRERATOPM = {
        ADD: 0,
        DELETE: 1,
        GET: 3,
        LIST: 4,
        USE_CODE: 100,
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
    addCode(data, success, error) {
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
    CODE_PREFIX,
    useCode(data, success, error) {
        $Service.post(SERVIE, null, [OPRERATOPM.USE_CODE, {
            userId: $Service.getUserId(),
            code: data.code,
            phoneEncryptedData: data.phoneEncryptedData,
            phoneEncryptedIv: data.phoneEncryptedIv,
            userEncryptedData: data.userEncryptedData,
            userEncryptedIv: data.userEncryptedIv,
            pubAccUserId: data.pubAccUserId
        }], function (res) {
            success(res)
        }, function (res) {
            error(res)
        })
    }
}


module.exports = Methods;