// pages/dispatch/orders/orders.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [
      {
        orderTime: "2019-08-22 11:12:13",
        addr: "南宁市民族大道222号",
        endTime: "2019-08-22 11:12:13",
        vip: true,
        preDate: "2019-08-22 11:12:13",
        carNo:"桂Aaasfdas",
        carType:"奔驰",
        carColor:"红色",
        latitude: 23.099994,
        longitude: 113.324520,
      },
      {
        orderTime: "2019-08-22 11:12:13",
        addr: "南宁市民族大道122号",
        endTime: "2019-08-22 11:12:13",
        vip: false,
        preDate: null,
        carNo:"桂A1234",
        carType:"toyota",
        carColor:"蓝色",
        latitude: 23.099994,
        longitude: 113.324520,
      },
      {
        orderTime: "2019-08-22 11:12:13",
        addr: "南宁市民族大道122号",
        endTime: "2019-08-22 11:12:13",
        vip: false,
        preDate: null,
        carNo:"桂Aasdasddd",
        carType:"五林",
        carColor:"白色",
        latitude: 23.099994,
        longitude: 113.324520,
      }
    ],
    current: 'tab1',
    current_scroll: 'tab1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let orders = this.data.orders
    for (let idx in orders) {
      let order = orders[idx]
      let orderTime = order.orderTime
      order.orderTimeFormart = orderTime.substr(11, 5)
    }
    this.setData({
      orders: orders
    })
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
    const orders = this.data.orders
    let doCnt = 0;
    let undoCnt = 0;
    if (orders) {
      for (let i = 0; i < orders.length; i++) {
        let order = orders[i]
        if (order.isDeal) {
          doCnt++
        } else {
          undoCnt++
        }
      }
    }
    this.setData({
      doCnt: doCnt,
      undoCnt: undoCnt
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
  detailBut: function(e) {
    const orderIdx = e.currentTarget.dataset.idx
    let order = this.data.orders[orderIdx]
    const _this = this
    wx.navigateTo({
      url: '/pages/dispatch/detail/detail',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function(data) {
          console.log(data.data.isDeal)
          _this.setData({
            ['orders[' + orderIdx + '].isDeal']: data.data.isDeal
          })
        },
        // someEvent: function (data) {
        //   console.log(data)
        // }
      },
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          data: order
        })
      }
    })
  },
  handleChange({
    detail
  }) {
    this.setData({
      current: detail.key
    });
  },

  handleChangeScroll({
    detail
  }) {
    this.setData({
      current_scroll: detail.key
    });
  }
})