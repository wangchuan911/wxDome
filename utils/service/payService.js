const $Service = require('./service');


const OPRERATOPM = {
    ADD: 0,
    MODIFY: 2,
    GET: 3,
    LIST: 4,
    GET_WORKERS: 100
}
const SERVIE = "pay";

function nonceStr() {
    const arr = [];
    const arr1 = [];
    while (arr.length < 32) {
        var index = Math.floor(Math.random() * 52);
        var offset = (index < 26) ? 0x41 : 0x61
        var code = index % 26 + offset;
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
const methods={

}
module.exports = methods