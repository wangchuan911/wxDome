// component/wave2/wave.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
      initValue:function(){
        const that = this
        var topNum = 100;
        var timer = setInterval(function () {
          topNum -= 0.05;
          var text = parseInt(100 - topNum) + "%";
          that.setData({
            tips: text,
            top: topNum + "%"
          })
          if (topNum <= 0) {
            clearInterval(timer);
          }
        }, 1);
      }
  }
})
