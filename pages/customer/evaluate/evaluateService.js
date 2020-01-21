const $Service = require('../../../utils/service/service');

const MAX_STAR_VAL = 5;
const OPRERATOPM = {
    ADD: 0,
    MODIFY: 2,
    GET: 3,
    LIST: 4,
    GET_WORKERS: 100
}
const SERVIE = "evaluateManager";
/**
 * 建单
 * */
const getData = function (data) {
    return {
        orderId: data.orderId,
        userId: data.userId,
        remarks: data.remarks,
        star: starsValToInt(data.star)
    }
}
const starsValToInt = function (stars) {
    let v = 1;
    let v2 = 0;
    let i = 0
    do {
        v2 += (v * stars[i]);
        console.info(v2)
        v = v * MAX_STAR_VAL
    }
    while (++i < stars.length);
    return v2;
};
const intToStarsVal = function (val) {
    let v = val
    let v1 = []
    while (v > 0) {
        v1.push(v % MAX_STAR_VAL);
        v = Math.floor(v / MAX_STAR_VAL)
        console.info(v1);
    }
    return v1;
}
const Methods = {
    add: function (data, success, error) {
        $Service.post(SERVIE, [OPRERATOPM.MODIFY, getData(data)], success, error)
    },
    get: function (data, success, error) {
        $Service.post(SERVIE, [OPRERATOPM.GET, getData(data)], res => {
            res.data.star
        }, error)
    }
}


module.exports = Methods;