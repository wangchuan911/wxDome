const $Service = require('./service');

const WASH_MAIN_TAMPLATE = 1;
const OPRERATOPM = {
    ADD: 0,
    GET: 3,
    LIST: 4,
    GET_WORK_NUM: 10,
}
const SERVIE = "tacheManager";
/**
 * 建单
 * */
const Methods = {
    getTaccheMap: function (data, success, error) {
        const dat = wx.getStorageSync(SERVIE);
        const today = new Date();
        if (dat && dat.date) {
            var dataDay = new Date(dat.date);
            if ((today.getDate() - dataDay.getDate()) < 1
                || (today.getMonth() - dataDay.getMonth()) < 1
                || (today.getFullYear() - dataDay.getFullYear()) < 1)
                if (success)
                    success(dat.data)
            return
        }
        $Service.post(SERVIE, [OPRERATOPM.LIST, {
            "tampalateId": WASH_MAIN_TAMPLATE,
        }], function (res) {
            wx.setStorageSync(SERVIE, {
                date: new Date().valueOf(),
                data: res.data.result
            })
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