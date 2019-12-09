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
                                } else {
                                    wx.showToast({
                                        title: '授权失败',
                                        icon: 'none',
                                        duration: 1000
                                    })
                                }
                            },
                            fail: function (res) {
                                console.log("调起失败")
                            }
                        })
                    },
                    fail: function (res) {
                        console.log(res.cancel)
                    }
                })
            }
        },
    })
}


module.exports = {
    formatTime: formatTime,
    getDate: getDate,
    getPositionAuth: getPositionAuth
}
