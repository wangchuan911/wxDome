// pages/index2/extra/extra.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      imgUrls:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      const _this = this
      const eventChannel = this.getOpenerEventChannel()
      // eventChannel.emit('acceptDataFromOpenedPage', { data: 'test' });
      // eventChannel.emit('someEvent', { data: 'test' });
      // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
      eventChannel.on('acceptDataFromOpenerPage', function(data) {
          console.info(data)
          _this.setData({
              imgUrls:data.extra.value2||[],
              value1:data.extra.value1
          })
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
    addPicture:function(){
        const _this=this
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths
                const imgUrls = (_this.data.imgUrls||[]).concat(tempFilePaths)
                _this.setData({
                    imgUrls: imgUrls
                })
            }
        })
    },
    preViewPicture:function (e) {
        const imgUrls=this.data.imgUrls
        wx.previewImage({
            current: imgUrls[e.currentTarget.dataset.idx], // 当前显示图片的http链接
            urls: imgUrls // 需要预览的图片http链接列表
        })
    },
    submitBut:function (e) {
      console.info(e.detail)
        const _this = this
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.emit('acceptDataFromOpenedPage', {
            data: {
                value1:e.detail.value.value1,
                value2:this.data.imgUrls
            }
        });
        wx.navigateBack({

        })
    }
})