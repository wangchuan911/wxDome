const $Service = require('./service');


const OPRERATOPM = {
    ADD: 0,
    MODIFY: 2,
    GET: 3,
    LIST: 4,
    GET_WORKERS: 100
}
const SERVIE = "pay";

function nonceStr(length) {
    const arr = [];
    const arr1 = [];
    while (arr.length < (length || 32)) {
        const index = Math.floor(Math.random() * 52);
        const offset = (index < 26) ? 0x41 : 0x61
        const code = index % 26 + offset;
        arr1.push(code)
        arr.push(String.fromCharCode(code))
    }
    console.info(arr1.join(","))
    return arr.join("");
}

function timeStamp(isSeccond) {
    const date = new Date().valueOf();
    return isSeccond ? Math.floor(date / 1000) : date;
}

const methods = {
    pay: function (data, success, fail) {
        const param = {
            B1: -2,
            B2: nonceStr(32) + data.orderId + '.' + timeStamp(true) + '.' + data.custId,
        }
        $Service.get(param,
            function (data) {
                wx.requestPayment({
                    timeStamp: param.timeStamp,
                    nonceStr: param.nonceStr,
                    package: '',
                    signType: 'MD5',
                    paySign: '',
                    success: success,
                    fail: fail
                })
            },
            fail)
    }
}
module.exports = methods