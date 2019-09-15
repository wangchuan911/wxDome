// pages/index2/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: {
      spin: true,
      submitBut: false
    },
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    txt: "",
    progressShow: {
      count: 0, //计数器，初始值为0
      maxCount: 100, // 绘制一个圆环所需的步骤 
      progress: 51, // 绘制一个圆环所需的步骤 
      countTimer: null //定时器，初始值为null
    },
    markers: [{
      //iconPath: "/resources/others.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50,
      callout: {
        color: "red",
        content: '详细',
        fontSize: 20,
        borderWidth: 2,
        padding: 10,
        borderRadius: 20,
        textAlign: "center"
      }
    }],
    // polyline: [{
    //   points: [{
    //     longitude: 113.3245211,
    //     latitude: 23.10229
    //   }, {
    //     longitude: 113.324520,
    //     latitude: 23.21229
    //   }],
    //   color: "#FF0000DD",
    //   width: 2,
    //   dottedLine: true
    // }],
    // controls: [{
    //   id: 1,
    //   iconPath: '/resources/location.png',
    //   position: {
    //     left: 0,
    //     top: 300 - 50,
    //     width: 50,
    //     height: 50
    //   },
    //   clickable: true
    // }]
    tags: [{
      checked: false,
      value: null,
      text: "预约",
      id: "book"
    }, {
      checked: false,
      value: null,
      text: "取车时间",
      id: "useTime"
    }, {
      checked: false,
      value: null,
      text: "备注",
      id: "extraInfo"
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const _this = this
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        _this.setData({
          ['loading.spin']: false
        })
        _this.setData({
          ['markers[0].latitude']: res.latitude,
          ['markers[0].longitude']: res.longitude,
        })
        // const speed = res.speed
        // const accuracy = res.accuracy
      }
    })
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    if (this.isBook) {
      this.initCircle();
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (this.circle1)
      this.countInterval()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.clearInterval()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.clearInterval()
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
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  callouttap(e) {
    console.log(e.markerId)
  },
  markMapBut(e) {
    console.info(e)
    this.data.markers[0]
  },
  bookBut: function() {
    if (this.data.loading.submitBut) return
    const _this = this
    _this.setData({
      isBook: true,
      ['loading.submitBut']: true
    })
    setTimeout(function() {
      _this.initCircle();
      _this.setData({
        ['loading.submitBut']: false
      })
    }, 2000)
    setTimeout(function() {
      _this.setData({
        ['progressShow.progress']: 21
      })
    }, 7000)
  },
  mileStoneBut: function() {
    const isAdmin = wx.getStorageSync('isAdmin')

    const _this = this
    wx.navigateTo({
      url: isAdmin ? '/pages/dispatch/orders/orders' : '/pages/customer/milestone/milestone',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function(data) {
          console.log(data)
          wv.change(50);
        },
      },
      success: function(res) {}
    })
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
  tagChangeBut(event) {
    const detail = event.detail;
    const _this = this
    console.info(detail);
    if(this.data.tags[detail.name].id=='extraInfo'){
      wx.navigateTo({
        url: '/pages/index2/extra/extra',
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          acceptDataFromOpenedPage: function(data) {
            _this.setData({
              ['tags[' + event.detail.name + '].checked']: detail.checked
            })
          },
        },
        success: function(res) {}
      })
    }else{
      _this.setData({
        ['tags[' + event.detail.name + '].checked']: detail.checked
      })
    }

  },
  openMap: function() {
    const _this = this
    wx.chooseLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const name = res.name
        const address = res.address
        const markers = _this.data.markers
        markers[0].latitude = latitude
        markers[0].longitude = longitude
        //返回的指显示到界面上
        _this.setData({
          value1: name,
          markers: markers
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
  countInterval: function() {
    // 设置倒计时 定时器 假设每隔100毫秒 count递增+1，当 count递增到两倍maxCount的时候刚好是一个圆环（ step 从0到2为一周），然后改变txt值并且清除定时器
    const _this = this
    this.clearInterval();
    this.data.progressShow.countTimer = setInterval(() => {
      if (this.data.progressShow.count == this.data.progressShow.progress) {
        return;
      }
      if (this.data.progressShow.count != this.data.progressShow.maxCount) {
        // 绘制彩色圆环进度条
        this.circle1.drawCircle('circle_draw1', 50, 8, this.data.progressShow.count * 2 / this.data.progressShow.maxCount)
        if (this.data.progressShow.count < this.data.progressShow.progress) {
          this.data.progressShow.count++;
        } else {
          this.data.progressShow.count--
        }
        this.setData({
          txt: this.data.progressShow.count + '%'
        });

      } else {
        this.setData({
          txt: "完成"
        });
        this.clearInterval();
      }
    }, 100)
    console.info("countInterval:"+this.data.progressShow.countTimer)
  },
  clearInterval:function () {
    if (this.data.progressShow.countTimer){
      clearInterval(this.data.progressShow.countTimer);
      console.info("clearInterval:"+this.data.progressShow.countTimer)
      this.data.progressShow.countTimer = null;
    }
  }
  ,
  initCircle() {
    // 获得circle组件
    this.circle1 = this.selectComponent("#circle1");
    // 绘制背景圆环
    this.circle1.drawCircleBg('circle_bg1', 50, 8);
    this.countInterval()
  }
})