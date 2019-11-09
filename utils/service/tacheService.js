const $Service = require('./service');
const $PubConst = require('../pubConst');

const WASH_MAIN_TAMPLATE = 1;
const OPRERATOPM = {
    ADD: 0,
    GET: 3,
    LIST: 4,
    GET_WORK_NUM: 10,
}

const STATE = {
    WAIT: -1,
    END: -2,
}
const SERVIE = "tacheManager";
/**
 * 建单
 * */
var initTacheMap = function (taches) {
    if (taches && taches.length > 0) {
        const t = []
        for (let i in taches) {
            t.push({
                id: taches[i].tacheId,
                state: taches[i].seq,
                name: taches[i].tacheName,
                desc: "正在" + taches[i].tacheName,
                code: taches[i].code
            })
        }
        $PubConst.setValue("customer.step1", t);
    }
}
const Methods = {
    STATE: STATE,
    getTaccheMap: function (data, success, error) {
        const dat = wx.getStorageSync(SERVIE);
        const today = new Date();
        if (dat && dat.date) {
            var dataDay = new Date(dat.date);
            if ((today.getDate() - dataDay.getDate()) < 1
                || (today.getMonth() - dataDay.getMonth()) < 1
                || (today.getFullYear() - dataDay.getFullYear()) < 1) {
                initTacheMap(dat.data)
                if (success)
                    success(dat.data)
                return
            }
        }
        $Service.post(SERVIE, [OPRERATOPM.LIST, {
            "tampalateId": WASH_MAIN_TAMPLATE,
        }], function (res) {
            wx.setStorageSync(SERVIE, {
                date: new Date().valueOf(),
                data: res.data.result
            })
            initTacheMap(res.data.result)
            if (success)
                success(res.data.result)
        }, error)
    }, getWorkBum: function (data, success, error) {
        $Service.post(SERVIE, [OPRERATOPM.GET_WORK_NUM, {
            "userId": data.userId,
        }], success, error)
    },
    getLocalTaccheMap: function () {
        return wx.getStorageSync(SERVIE).data;
    }

}


module.exports = Methods;