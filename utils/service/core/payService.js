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

const _pay = (dataObj, option, success, fail) => {
    /*const dataObj = {
        nonceStr: nonceStr(32),
        timeStamp: timeStamp(true) + "",
    }*/
    const param = {
        B1: option.code,
        B2: dataObj.datStr,
    }
    $Service.get(param, {URL_CODE: option.urlCode},
        (data) => {
            wx.requestPayment({
                timeStamp: dataObj.timeStamp,
                nonceStr: dataObj.nonceStr,
                package: 'prepay_id=' + data.data.prePayId,
                signType: 'MD5',
                paySign: data.data.sign,
                success: success,
                fail: fail
            })
        },
        fail)
}, payReqBaseBody = () => {
    return {
        nonceStr: nonceStr(32),
        timeStamp: timeStamp(true) + "",
    }
}
const methods = {
    pay: (data, success, fail) => {
        const dataObj = payReqBaseBody();
        dataObj.datStr = dataObj.nonceStr + data.orderId + '.' + dataObj.timeStamp + '.' + data.custId;
        return _pay(dataObj, {code: -2}, success, fail);
    },
    mallPay: (data, success, fail) => {
        const dataObj = payReqBaseBody();
        dataObj.datStr = dataObj.nonceStr + data.id + '.' + data.num + '.' + dataObj.timeStamp + '.' + data.custId;
        return _pay(dataObj, {code: -3, urlCode: "MALL_PAY"}, success, fail);
    },
}
module.exports = methods