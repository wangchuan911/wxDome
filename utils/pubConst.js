module.exports = {
    customer: {
        step1: [
            {
                state: 0,
                name: "订单受理",
                desc: "正在为您指派服务人员"
            },
            {
                state: 1,
                name: "派遣服务人员",
                desc: "正在派遣服务人员"
            },
            {
                state: 2,
                name: "车辆评估",
                desc: "评估车辆，提供最合适的服务"
            },
            {
                state: 3,
                name: "车辆服务中",
                desc: "正在为您的车辆提供服务"
            }
        ]
    },
    worker: {
        step1: [{
            desc: "前往目的地"
            , fin_desc: "已到达"
            , id: 0
            , but_desc: "到达"
        }, {
            desc: "洗前车辆评估"
            , fin_desc: "评估完成"
            , id: 1
            , but_desc: "评估"
        }, {
            desc: "开始服务"
            , fin_desc: "服务完成"
            , id: 2
            , but_desc: "结果反馈"
        }, {
            desc: "等待客户验收"
            , id: 3
        }]
    },
    operationCodes: {
        dispatch:{
            name: "人员派遣"
        },
        reach: {
            name: "签到"
        },
        preCheck: {
            name: "车辆评估"
        },
        washIn: {
            name: "服务完成确认（车内）"
        },
        washOut: {
            name: "服务完成确认（车外）"
        }
    },
    optionTaches: [{
        checked: true,
        value: null,
        text: "室外",
        id: "washOut",
        tacheId: 8
    }, {
        checked: false,
        value: null,
        text: "室内",
        id: "washIn",
        tacheId: 9
    }],
    setValue: function (key, value) {
        const keys = key.split(".");
        let dat = this;
        for (var idx = 0; idx < keys.length; idx++) {
            if (idx != keys.length - 1)
                dat = dat[keys[idx]]
            else
                dat[keys[idx]] = value
        }
    }
}