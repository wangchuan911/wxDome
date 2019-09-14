// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value1: "",
    value2: "",
    value3: "",
    value4: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  openMap: function() {
    const that = this
    wx.chooseLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const name = res.name
        const address = res.address
        //返回的指显示到界面上
        that.setData({
          value2: address,
          value1: name
        })
      }
    })
  },
  changeTime: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      value3: e.detail.value
    })
  },
  changeTime2: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      value4: e.detail.value
    })
  },
  submitBut: function() {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('acceptDataFromOpenedPage', {
      data: {
        isBook: true
      }
    });

    wx.navigateBack({
    })
  }

})