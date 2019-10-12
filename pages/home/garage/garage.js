// pages/home/garage/garage.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loading: {submitBut: false},
        page: {
            recordInfo: {
                enable: false,
                carNo: "",
                keyBoardType: 1,
                color: {
                    index: 0,
                    array: [
                        "纯黑", '纯白', '红色', '酒红', '蓝色', '深蓝', '黄色', '金色', '绿色', '青色', '粉色'
                    ]
                },
                type: {
                    index: 0,
                    array: [
                        "轿车","皮卡","SUV"
                    ]
                }
            },
            carList: {
                cars: [{
                    carBrand:"五菱",
                    carNo:"贵A00835",
                    carColor:"纯黑",
                    carType:"越野车"
                }],
                enable: true
            }
        },
        /*multiArray: [['无脊柱动物', '脊柱动物']],
        objectMultiArray: [
          [
            {
              id: 0,
              name: '无脊柱动物'
            },
            {
              id: 1,
              name: '脊柱动物'
            }
          ], [
            {
              id: 0,
              name: '扁性动物'
            },
            {
              id: 1,
              name: '线形动物'
            },
            {
              id: 2,
              name: '环节动物'
            },
            {
              id: 3,
              name: '软体动物'
            },
            {
              id: 3,
              name: '节肢动物'
            }
          ], [
            {
              id: 0,
              name: '猪肉绦虫'
            },
            {
              id: 1,
              name: '吸血虫'
            }
          ]
        ],
        multiIndex: [0],*/
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(this.data.page.carList.cars.length==0){
            this.addCar();
        }
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
    handleOpen1: function () {
        this.setData({
            visible1: true
        });
    },
    inputChange: function (e) {
        console.info(e.detail)
        if (e.detail) {
            const carNo = this.data.page.recordInfo.carNo + e.detail
            this.setData({
                ['page.recordInfo.carNo']: carNo
            })
        }
        const keyBoardType = (this.data.page.recordInfo.carNo.length >= 1) ? 2 : 1
        this.setData({
            ['page.recordInfo.keyBoardType']: keyBoardType
        })
    },
    inputdelete: function (e) {
        const carNo = this.data.page.recordInfo.carNo
        if (carNo.length > 0) {
            this.setData({
                ['page.recordInfo.carNo']: carNo.substr(0, carNo.length - 1)
            })
        }
    },
    inputOk: function (e) {
        this.closeBut()
    },
    closeBut: function () {
        this.setData({
            visible1: false
        });
    },
    addCar: function () {
        this.setData({
            ["loading.submitBut"]:true
        })
        if (this.data.page.recordInfo.enable) {
            const cars = this.data.page.carList.cars;
            cars.push({
                carNo: this.data.page.recordInfo.carNo,
                carBrand:this.data.page.recordInfo.carBrand,
                carColor:this.data.page.recordInfo.color.value,
                carType:this.data.page.recordInfo.type.value
            })
            this.setData({
                ['page.carList.cars']: cars,
                ['page.recordInfo.enable']:false,
                ['page.carList.enable']:true
            })
        } else if (this.data.page.carList.enable) {
            this.setData({
                ['page.recordInfo.enable']:true,
                ['page.carList.enable']:false
            })
        }
        this.setData({
            ["loading.submitBut"]:false
        })
    },
    pickerChange: function (e) {
        switch (e.currentTarget.id) {
            case "color":
                this.setData({
                    ['page.recordInfo.color.value']: this.data.page.recordInfo.color.array[e.detail.value]
                });
                break;
            case "type":
                this.setData({
                    ['page.recordInfo.type.value']: this.data.page.recordInfo.type.array[e.detail.value]
                });
                break;
        }
        console.info(e)
    },
    inputBut: function (e) {
        switch (e.currentTarget.id) {
            case "carNo":
                this.setData({
                    visible1: true
                });
                break;
        }
        console.info(e)

    },
    bindMultiPickerChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            multiIndex: e.detail.value
        })
    },
    bindMultiPickerColumnChange: function (e) {
        console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
        var data = {
            multiArray: this.data.multiArray,
            multiIndex: this.data.multiIndex
        };
        data.multiIndex[e.detail.column] = e.detail.value;
        switch (e.detail.column) {
            case 0:
                switch (data.multiIndex[0]) {
                    case 0:
                        data.multiArray[1] = ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'];
                        data.multiArray[2] = ['猪肉绦虫', '吸血虫'];
                        break;
                    case 1:
                        data.multiArray[1] = ['鱼', '两栖动物', '爬行动物'];
                        data.multiArray[2] = ['鲫鱼', '带鱼'];
                        break;
                }
                data.multiIndex[1] = 0;
                data.multiIndex[2] = 0;
                break;
            case 1:
                switch (data.multiIndex[0]) {
                    case 0:
                        switch (data.multiIndex[1]) {
                            case 0:
                                data.multiArray[2] = ['猪肉绦虫', '吸血虫'];
                                break;
                            case 1:
                                data.multiArray[2] = ['蛔虫'];
                                break;
                            case 2:
                                data.multiArray[2] = ['蚂蚁', '蚂蟥'];
                                break;
                            case 3:
                                data.multiArray[2] = ['河蚌', '蜗牛', '蛞蝓'];
                                break;
                            case 4:
                                data.multiArray[2] = ['昆虫', '甲壳动物', '蛛形动物', '多足动物'];
                                break;
                        }
                        break;
                    case 1:
                        switch (data.multiIndex[1]) {
                            case 0:
                                data.multiArray[2] = ['鲫鱼', '带鱼'];
                                break;
                            case 1:
                                data.multiArray[2] = ['青蛙', '娃娃鱼'];
                                break;
                            case 2:
                                data.multiArray[2] = ['蜥蜴', '龟', '壁虎'];
                                break;
                        }
                        break;
                }
                data.multiIndex[2] = 0;
                break;
        }
        console.log(data.multiIndex);
        this.setData(data);
    },
})