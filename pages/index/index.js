//index.js
//获取应用实例
const app = getApp()
var waveUtils = require('../../utils/wave.js')
var wv = null;
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    tips: "1%",
    tapCir: "newOrder"
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../home/home'
    })
  },
  newOrder: function(e) {},
  onLoad: function() {
    const ctx = wx.createCanvasContext('canvasArcCir')
    wv = waveUtils.wave(ctx, 0, {
      heigth: 200,
      width: 200
    });
    wv.preStart({
      text: "开始"
    });
    this.setData({
      tapCir: "newOrder"
    })

    // wv.change(100)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  canvasIdErrorCallback: function(e) {
    console.error(e.detail.errMsg)
  },
  onReady: function(e) {

    }
    /**
     * 生命周期函数--监听页面隐藏
     */
    ,
  onHide: function() {
    console.info("hide")
    wv.stop();
  },
  onShow: function() {
    console.info("show")
    if(this.data.isBook){
      wv.start();
    }
  },
  mine: function() {
    wx.navigateTo({
      url: '/pages/home/mime/mine',
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
  },
  bookBut: function() {
    const _this = this
    wx.navigateTo({
      url: '/pages/customer/order/order',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function(data) {
          console.log(data)
          _this.setData({
            isBook:data.data.isBook
          })
          wv.change(50);
        },
        // someEvent: function (data) {
        //   console.log(data)
        // }

      },
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        // res.eventChannel.emit('acceptDataFromOpenerPage', {
        //   data: order.id
        // })
      }
    })
  },
  mileStoneBut: function () {
    const isAdmin=wx.getStorageSync('isAdmin')

    const _this = this
    wx.navigateTo({
      url: isAdmin ?'/pages/dispatch/orders/orders':'/pages/customer/milestone/milestone',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (data) {
          console.log(data)
          wv.change(50);
        },
      },
      success: function (res) {
      }
    })
  }
})