const $Service = require('./service');
const $PubConst = require('../../pubConst');

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
const findSubTache = (tacheRelas, findObj) => {
    (tacheRelas || []).forEach(tacheRela => {
        (tacheRela.childTaches || []).forEach(tache => {
            findObj(tache)
        });
    });
}
const initTacheMap = (taches) => {
    const tacheMap2 = {}
    const node = (tache) => {
        const subTache = function (tacheRelas) {
            const ids = [];
            /*(tacheRelas || []).forEach(tacheRela => {
                (tacheRela.childTaches || []).forEach(tache => {
                    ids.push(tache.tacheId);
                    subTache(tache.childTaches)
                });
            });*/
            findSubTache(tacheRelas, tache => {
                ids.push(tache.tacheId);
                tacheMap2[tache.tacheId] = tache;
                subTache(tache.tacheRelas || []);
            })
            /*for (let i = 0; i < tacheRelas; i++) {
                tacheRelas.childTaches
            }*/
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
            tacheMap2[taches[i].tacheId] = taches[i];
        }
        $PubConst.setValue("customer.step1", t);
        $PubConst.setValue("customer.stepMap", tacheMap2);
    }
}
const initTemplates = taches => {
    const map = {}
    const findPush = (tache) => {
        (tache.pushConfigs || []).forEach(config => {
            if (config.roleId == null) return;
            const arr = map[config.roleId] || [];
            if (arr.indexOf(config.templateId) >= 0) return;
            map[config.roleId] = arr;
            map[config.roleId].push(config.templateId)
        })
    };
    taches.forEach(tache => {
        findPush(tache);
        findSubTache(tache.tacheRelas || [], tache => {
            findPush(tache);
        })
    });
    if (map && Object.keys(map).length > 0) {
        $PubConst.setValue("customer.templates", map);
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
                initTacheMap(dat.data);
                initTemplates(dat.data);
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
            initTacheMap(res.data.result);
            initTemplates(res.data.result);
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