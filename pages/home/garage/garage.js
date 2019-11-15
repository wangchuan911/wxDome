// pages/home/garage/garage.js

const {$Message} = require('../../../ui/iview/base/index');
const $CarService = require('../../../utils/service/carService')
const $UserService = require('../../../utils/service/userService')
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
                        "轿车", "皮卡", "SUV"
                    ]
                }
            },
            carList: {
                cars: [],
                enable: true
            },
            carActon: {
                items: [
                    {
                        name: '设为默认',
                    },

                    {
                        name: '删除',
                        color: '#ed3f14'
                    }
                ],
                showActionSheet: false
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
        const _this = this
        $CarService.getCars({}, function (res) {
            const data = res.data.result;
            const cars = [];
            let obj = null;
            for (let i in data) {
                obj = {
                    carBrand: data[i].brand,
                    carNo: data[i].lisence,
                    carColor: data[i].color,
                    carType: data[i].modal,
                    defaultCar: data[i].defaultSelected
                }
                if (data[i].defaultSelected) {
                    cars.unshift(obj)
                } else {
                    cars.push(obj)
                }
                cars.push();
            }
            _this.setData({
                ['page.carList.cars']: cars
            })
            if (_this.data.page.carList.cars.length == 0) {
                _this.addCar();
            }
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
    addCarBut: function (e) {
        console.info(e)
        const _this = this
        if (!e.detail.userInfo) {
            return
        } else if (wx.getStorageSync("newUser")) {
            $UserService.newUserr({
                name: e.detail.userInfo.nickName
            }, res => {
                wx.removeStorageSync("newUser")
                _this.addCar();
            })
        } else {
            this.addCar()
        }
    },
    addCar: function () {
        const _this = this
        this.setData({
            ["loading.submitBut"]: true
        })

        function end() {
            _this.setData({
                ['page.recordInfo.enable']: false,
                ['page.carList.enable']: true,
                ["loading.submitBut"]: false
            })
        }

        if (this.data.page.recordInfo.enable) {
            const cars = this.data.page.carList.cars;
            const data = {
                carNo: this.data.page.recordInfo.carNo,
                carBrand: this.data.page.recordInfo.carBrand,
                carColor: this.data.page.recordInfo.color.value,
                carType: this.data.page.recordInfo.type.value
            };
            $CarService.addCar({
                brand: data.carBrand,
                lisence: data.carNo,
                color: data.carColor,
                modal: data.carType,
                defaultSelected: 0,
            }, function (res) {
                cars.push(data);
                _this.setData({
                    ['page.carList.cars']: cars,
                })
                end();
            }, function () {
                end();
            })
        } else if (this.data.page.carList.enable) {
            this.setData({
                ['page.recordInfo.enable']: true,
                ['page.carList.enable']: false
            })
            this.setData({
                ["loading.submitBut"]: false
            })
        }
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

    }, carActionBut: function (e) {
        const flag = !this.data.page.carActon.showActionSheet
        this.setData({
            ['page.carActon.showActionSheet']: flag
        })
        if (flag) {
            this.data.page.carActon.carIdx = e.currentTarget.dataset.idx
        } else {
            this.data.page.carActon.carIdx = -1;
        }
    },
    carOperationBut: function ({detail}) {
        const _this = this;
        const index = detail.index;
        const action = [...this.data.page.carActon.items];

        function LOADING(flag) {
            action[index].loading = flag;
            _this.setData({
                ['page.carActon.items']: action
            });
            if (!flag) {
                _this.carActionBut()
            }
        }

        LOADING(true)
        switch (index) {
            case 0:
                $CarService.setDefault({
                    lisence: this.data.page.carList.cars[this.data.page.carActon.carIdx].carNo
                }, function (res) {
                    const cars = _this.data.page.carList.cars;
                    const newCars = []
                    for (let i = 0; i < cars.length; i++) {
                        if (_this.data.page.carActon.carIdx == i) {
                            cars[i].defaultCar = true
                            newCars.unshift(cars[i])
                        } else {
                            cars[i].defaultCar = false
                            newCars.push(cars[i])
                        }
                    }
                    _this.setData({
                        ['page.carList.cars']: newCars
                    })
                    LOADING(false)
                }, function () {
                    LOADING(false)
                });
                break;
            case 1:
                $CarService.delCar({
                    lisence: this.data.page.carList.cars[this.data.page.carActon.carIdx].carNo
                }, function (res) {
                    const cars = _this.data.page.carList.cars;
                    cars.splice(_this.data.page.carActon.carIdx, 1);
                    _this.setData({
                        ['page.carList.cars']: cars
                    })
                    LOADING(false)
                }, function () {
                    LOADING(false)
                });
                break;
        }
    }

    /*bindMultiPickerChange: function (e) {
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
    },*/
})