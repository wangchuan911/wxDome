// pages/milestone/customer/milestone.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [{
        isCustOrder: true
      },
      {
        isFinish: true
      }
    ]
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
    const isWorker = wx.getStorageSync("isWorker");
    console.info("isWorker:" + isWorker)
    let orders = this.data.orders || []
    for (let idx in orders) {
      if (isWorker) {
        orders[idx].isWorkOrder = true
        orders[idx].isCustOrder = false
      } else {
        orders[idx].isCustOrder = true
        orders[idx].isWorkOrder = false
      }
    }
    this.setData({
      orders: orders
    })
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
  orderDetailBut:function(){
    wx.navigateTo({
      url: '/pages/customer/detail/detail',
      /*events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (data) {
          console.log(data)
        },
        someEvent: function (data) {
          console.log(data)
        }
      },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
      }*/
    })
  }
})