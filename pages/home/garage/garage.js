// pages/home/garage/garage.js

const {$Message} = require('../../../ui/iview/base/index'),
    $CarService = require('../../../utils/service/core/carService'),
    $UserService = require('../../../utils/service/core/userService'),
    $Util = require('../../../utils/util'),
    $PubConst = require('../../../utils/pubConst'),
    $Service = require('../../../utils/service/core/service');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loading: {submitBut: false},
        page: {
            recordInfo: {
                carBrand: "",
                enable: false,
                carId: null,
                carNo: "",
                phone: "",
                keyBoardType: 1,
                color: {
                    index: 0,
                    array: [
                        "纯黑", '纯白', '红色', '酒红', '蓝色', '深蓝', '香槟', '银灰', '咖啡', '黄色', '金色', '绿色', '青色', '粉色'
                    ]
                },
                type: {
                    index: 0,
                    array: [
                        "轿车", "SUV", "全尺SUV", '商务'
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
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        $Util.UILock(this, "loading.submitBut", false)
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
                    defaultCar: data[i].defaultSelected,
                    carModelId: data[i].carModelId,
                    carInfo: data[i].carInfo
                }
                if (data[i].defaultSelected) {
                    cars.unshift(obj);
                    $CarService.setDefaultCarData(obj)
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
        } else {
            this.addCar()
        }
    },
    addCar: function () {
        const _this = this
        const lock = $Util.lockUI(this, "loading.submitBut");

        function end() {
            _this.setData({
                ['page.recordInfo.enable']: false,
                ['page.carList.enable']: true,
            });
            lock.unlock();
        }

        function confireCheck(data) {
            var msg = null;
            msg = data.carNo ? msg : "车牌号不能为空";
            msg = data.carBrand ? msg : "车品牌不能为空";
            msg = data.carColor ? msg : "车颜色不能为空";
            msg = data.carType ? msg : "车类型不能为空";
            msg = (_this.data.page.carList.cars.length > 0 || data.phone) ? msg : "电话不能为空";
            return msg;
        }

        if (this.data.page.recordInfo.enable) {
            const cars = this.data.page.carList.cars;
            const data = {
                carNo: this.data.page.recordInfo.carNo,
                carBrand: this.data.page.recordInfo.carBrand,
                carColor: this.data.page.recordInfo.color.value,
                carType: this.data.page.recordInfo.type.value,
                defaultCar: _this.data.page.carList.cars.length > 0 ? false : true,
                phone: this.data.page.recordInfo.phone,
                carModelId: this.data.page.recordInfo.carId
            };
            const check = confireCheck(data)
            if (check != null) {
                wx.showToast({
                    title: check,
                    image: '/',
                    duration: 2000
                })
                lock.unlock();
                return
            }
            $CarService.addCar({
                brand: data.carBrand,
                lisence: data.carNo,
                color: data.carColor,
                modal: data.carType,
                defaultSelected: data.defaultCar ? 1 : 0,
                phone: data.phone,
                carModelId: data.carModelId
            }, function (res) {
                data.carInfo = res.data.result.carInfo;
                if (data.defaultCar) {
                    $CarService.setDefaultCarData(data)
                    $PubConst.setCost("priceInside", data.carInfo["priceInside"]);
                    $PubConst.setCost("priceOutside", data.carInfo["priceOutside"]);
                }
                if (data.phone) {
                    $UserService.setDefaultPhoneNum(data.phone)
                }
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
            lock.unlock();
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
                            cars[i].defaultCar = true;
                            newCars.unshift(cars[i]);
                            if (cars[i].defaultCar) {
                                $CarService.setDefaultCarData(cars[i])
                                $PubConst.setCost("priceInside", cars[i].carInfo["priceInside"]);
                                $PubConst.setCost("priceOutside", cars[i].carInfo["priceOutside"]);
                            }
                        } else {
                            cars[i].defaultCar = false;
                            newCars.push(cars[i]);
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
                    if (cars[_this.data.page.carActon.carIdx].defaultCar) {
                        $CarService.setDefaultCarData({})
                        $Service.setPageState("index.freshOrder", true);
                    }
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
    },
    textInputChange: function (e) {
        const value = e.detail.detail.value;
        switch (e.currentTarget.id) {
            case "phone":
                this.data.page.recordInfo.phone = value;
                break;
            case "carBand":
                this.data.page.recordInfo.carBrand = value;
                break;
        }
    },

    carTypeSelecttBut: function () {
        const _this = this;
        wx.navigateTo({
            url: '/pages/common/car/typeSelector/index',
            events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                acceptDataFromOpenedPage: function (res) {
                    console.info(res);
                    _this.setData({
                        ["page.recordInfo.carBrand"]: res.data.name,
                        ["page.recordInfo.carId"]: res.data.id
                    })
                },
            },
            success: function (res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', null)
            }
        })
    }
})