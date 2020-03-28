const $Service = require('./service');
const $PubConst = require('../pubConst');

const WASH_MAIN_TAMPLATE = 1;
const OPRERATOPM = {
    ADD: 0,
    GET: 3,
    LIST: 4,
    GET_WORK_NUM: 100,
}

const STATE = {
    WAIT: -1,
    END: -2,
}
const SERVIE = "tache";
/**
 * 建单
 * */
const initTacheMap = function (taches) {
    const node = function (tache) {
        const subTache = function (tacheRelas) {
            const ids = [];
            (tacheRelas || []).forEach(tacheRela => {
                (tacheRela.childTaches || []).forEach(tache => {
                    ids.push(tache.tacheId);
                    subTache(tache.childTaches)
                });
            });
            for (let i = 0; i < tacheRelas; i++) {
                tacheRelas.childTaches
            }
            return ids;
        };
        return {
            id: tache.tacheId,
            state: tache.seq,
            name: tache.tacheName,
            desc: "正在" + tache.tacheName,
            code: tache.code,
            subTaches: subTache(tache.tacheRelas || [])
        }
    }
    if (taches && taches.length > 0) {
        const t = []
        for (let i in taches) {
            t.push(node(taches[i]))
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
        $Service.post(SERVIE, null, [OPRERATOPM.LIST, {
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
        $Service.post(SERVIE, null, [OPRERATOPM.GET_WORK_NUM, {
            "userId": $Service.getUserId(),
        }], success, error)
    },
    getLocalTaccheMap: function () {
        return wx.getStorageSync(SERVIE).data;
    }

}


module.exports = Methods;