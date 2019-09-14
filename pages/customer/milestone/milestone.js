// pages/milestone/customer/milestone.js
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
        state:0,
       imgs: [
         'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
         'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
         'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
       ]
      },
      {
        orderTime: "2019-08-22 11:12:13",
        addr: "南宁市民族大道122号xxx村xxxxx屋xxxxxx室",
        endTime: "2019-08-22 11:12:13",
        vip: false,
        preDate: null,
        carNo:"桂A1234",
        carType:"toyota",
        carColor:"蓝色",
        latitude: 23.099994,
        longitude: 113.324520,
        state:1,
        orderCost:10.00
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
        state:2,
        orderCost:10.00
      }
    ],
    cols:[
      {
        id:"addr",
        name:"地址"
      },
      {
        id:"orderTime",
        name:"时间"
      },
      {
        id:"worker",
        name:"服务员"
      },
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
  orderDetailBut:function(e){
    const order=this.data.orders[e.target.dataset.idx]
    wx.navigateTo({
      url: '/pages/customer/detail/detail',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (data) {
          console.log(data)
        },
      },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { order: order })
      }
    })
  },
  payBillBut:function () {
    wx.requestPayment({
      timeStamp: ""+new Date().getTime(),
      nonceStr: '',
      package: '',
      signType: 'MD5',
      paySign: '',
      success (res) {console.info("aa")},
      fail (res) { }
    })
  },
  preViewPicture:function(e){
    const imgs=this.data.orders[e.currentTarget.dataset.idx].imgs||[];
    const img=imgs[e.currentTarget.dataset.imgIdx]
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: imgs // 需要预览的图片http链接列表
    })
  },
})