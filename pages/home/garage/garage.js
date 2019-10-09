// pages/home/garage/garage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carNo:"",
    keyBoardType:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  handleOpen1:function(){
    this.setData({
      visible1: true
    });
  },
  inputChange: function (e) {
    console.info(e.detail)
    if(e.detail){
      const carNo=this.data.carNo+e.detail
      this.setData({
        carNo:carNo
      })
    }
    const keyBoardType = (this.data.carNo.length >= 1) ? 2 : 1
    this.setData({
      ['keyBoardType']: keyBoardType
    })
  },
  inputdelete: function (e) {
    const carNo = this.data.carNo
    if (carNo.length > 0) {
      this.setData({
        carNo: carNo.substr(0, carNo.length-1)
      })
    }
  },
  inputOk:function (e) {
    this.closeBut()
  },
  closeBut:function () {
    this.setData({
      visible1: false
    });
  }
})