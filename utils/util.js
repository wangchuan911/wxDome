const formatTime = date => {
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return getDate(date, '/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

const getDate = (date, spliter) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return [year, month, day].map(formatNumber).join(spliter);
}
const getPositionAuth = function () {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            success: function (res) {
                console.log(res)
                if (res.authSetting["scope.userLocation"] == false) {
                    console.log("判断失败后")
                    wx.showModal({
                        title: '请授权您的地理位置',
                        content: '需要您的地理位置',
                        success: function (res) {
                            console.log(res.cancel)
                            wx.openSetting({
                                success(res) {
                                    if (res.authSetting["scope.userLocation"] == true) {
                                        wx.showToast({
                                            title: '授权成功',
                                            icon: 'success',
                                            duration: 1000
                                        })
                                        resolve();
                                    } else {
                                        wx.showToast({
                                            title: '授权失败',
                                            icon: 'none',
                                            duration: 1000
                                        })
                                        reject();
                                    }
                                },
                                fail: function (res) {
                                    console.log("调起失败")
                                    reject();
                                }
                            })
                        },
                        fail: function (res) {
                            console.log(res.cancel)
                            reject();
                        }
                    })
                } else if ((res.errMsg || "").indexOf("ok")) {
                    resolve();
                } else {
                    reject();
                }
            },
        })
    });
}

function getDatePicker(date, option) {
    const maxDays = (option || {}).maxDay || 1;
    const arr1 = [];
    const hours = date.getHours();
    const minDay = hours > 18 ? 1 : 0;
    for (let day = minDay; day <= maxDays; day++) {
        date.setDate(date.getDate() + day);
        var date1 = (date.getMonth() + 1) + "月" + (date.getDate()) + '日';
        arr1.push(date1);
    }
    const arr2 = [];
    for (let i = (minDay > 0 || hours < 9) ? 9 : hours; i <= 18; i++) {
        i = (i < 10) ? '0' + i : i;
        arr2.push(i + "时");
    }
    const arr3 = ['00', '15', '30', '45'];
    arr3.forEach((value, index, array) => array[index] += '分');
    const arr = [arr1, arr2, arr3];
    return arr;
}

function getDatePickerHour(tomorrow) {
    const date = new Date();
    const hours = date.getHours();
    const minDay = (tomorrow ? 24 : hours) > 18 ? 1 : 0;
    if (!tomorrow && hours > 18) return [];
    const arr2 = [];
    for (let i = minDay > 0 ? 9 : hours; i <= 18; i++) {
        i = (i < 10) ? '0' + i : i;
        arr2.push(i + "时");
    }
    return arr2
}

function getPickerDate(dateStr) {
    const today = new Date();
    let date = (new Date().getFullYear()) + "-" + dateStr.replace(/时/, ':').replace(/分/, ':').replace(/月/, '-').replace(/日/, ' ') + '00.00';
    date = new Date(date);
    if (today.getMonth() == 11 && date.getMonth() == 0) {
        date.setFullYear(date.getFullYear() + 1);
    }
    console.info(date);
    return date;
}

const KEY_UI_LOCK_STATE = 'UI_LOCK_STATE';

function UILock(_this, butName, lock) {
    const butState = _this.data[KEY_UI_LOCK_STATE] || {};
    butState[butName] = lock || false
    _this.setData({[KEY_UI_LOCK_STATE]: butState});
}

function lockUI(_this, butName) {
    UILock(_this, butName, true);
    return function (_this, butName) {
        return {
            unlock: function () {
                unlockUI(_this, butName);
            }
        }
    }(_this, butName)
}

function unlockUI(_this, butName) {
    UILock(_this, butName, false);
    return function (_this, butName) {
        return {
            lock: function () {
                lockUI(_this, butName);
            },
        }
    }(_this, butName)
}

function isLock(_this, butName) {
    return _this.data[KEY_UI_LOCK_STATE][butName];
}

function setOneData(_this, name, value) {
    _this.setData({
        [name]: value
    })
}

const extend = (tar, des) => {
    Object.keys(tar).forEach(value => {
        switch (typeof tar[value]) {
            case "object":
                extend(tar[value], des[value] = des[value] || {})
            case "function":
                break;
            default:
                if (des[value]) return;
                des[value] = tar[value];
        }
    })
}

const text2Canvas = (title, text, option) => {
    const wxml = `<view class="container" >
        <text class="title">{{title}}</text>
        <text class="text">{{text}}</text>
        </view>`.replace('{{title}}', title || '无标题').replace('{{text}}', text || '无内容')
    const width = 300;
    const style = {
        container: {
            width: width,
            height: 200,
            backgroundColor: '#ccc'
        },
        text: {
            width: width,
            height: 100,
        },
        title: {
            width: width,
            height: 24
        }
    }
    return {wxml, style}
}
const costCompute = (serverTempate) => {
    if ((serverTempate || []).length == 0)
        return '服务无效';
    return serverTempate.filter(value => value.checked).map(value => value.cost).reduce((previousValue, currentValue) => previousValue += currentValue)
}
module.exports = {
    formatTime,
    getDate,
    getPositionAuth,
    getDatePicker,
    getPickerDate,
    UILock,
    lockUI,
    unlockUI,
    isLock,
    setOneData,
    getDatePickerHour,
    text2Canvas,
    costCompute,
    extend
}
