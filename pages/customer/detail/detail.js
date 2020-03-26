// pages/customer/detail/detail.js
const $PubConst = require('../../../utils/pubConst.js')
const $OperService = require('../../../utils/service/operationService');
const $TacheService = require('../../../utils/service/tacheService');
const $OrderService = require('../../../utils/service/orderService');
const $Service = require('../../../utils/service/service');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        current: 0,
        verticalCurrent: 0,
        steps: $PubConst.worker.step1,
        scroll: {
            left: 0,
            stepWidth: 100,
            initPos: 2,
            scrollViewWidth: 600
        },
        operation: {
            codes: $PubConst.operationCodes,
            /*butText: null,
            code: null,
            operationTacheId: null,
            butShow: false,*/
            oprBut: [],
            tmpData: {}
        },
        sendQuene: [],//待发送文件列队,
        tachePanelInfo: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            ["steps"]: $PubConst.customer.step1
        })

        const _this = this
        const eventChannel = this.getOpenerEventChannel()
        // eventChannel.emit('acceptDataFromOpenedPage', { data: 'test' });
        // eventChannel.emit('someEvent', { data: 'test' });
        // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
        wx.getSystemInfo({
            success: function (res) {
                _this.data.scroll.scrollViewWidth = res.screenWidth
                _this.data.scroll.stepWidth = parseInt(res.screenWidth / (_this.data.scroll.initPos + 1))
            }
        })
        eventChannel.on('acceptDataFromOpenerPage', function (data) {
            _this.initalOrder(data)
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
    deal: function (e) {
        const _this = this;
        const data = {
            orderId: this.data.order.orderId,
            tacheId: this.data.operation.oprBut[e.currentTarget.dataset.idx].operationTacheId,
        };
        const code = this.data.operation.oprBut[e.currentTarget.dataset.idx].code
        switch (code) {
            case "reach":
                data.doNext = true
                _this.toBeContinue(data);
                break;
            case"preCheck":
            /*data.doNext = true;
            _this.tackPicure(data);
            break;*/
            case "washIn":
            /*data.doNext = true;
            _this.tackPicure(data);
            break;*/
            case "washOut":
                wx.navigateTo({
                    url: '/pages/customer/operation/feedback/feedback',
                    events: {
                        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                        acceptDataFromOpenedPage: function (res) {
                            /*if (res.data) {
                                break;
                            }*/
                            console.info(res)
                            _this.data.operation.tmpData = res.data;
                            _this.data.sendQuene = function (quene, newImgs) {
                                (newImgs || []).forEach(value => {
                                    if (quene.indexOf(value) < 0) {
                                        quene.push(value)
                                    }
                                })
                                return quene;
                            }(_this.data.sendQuene, res.data.imgs)
                            data.doNext = true;
                            _this.tackPicure(data);
                        },
                    },
                    success: function (res) {
                        // 通过eventChannel向被打开页面传送数据
                        const params = _this.data.operation.tmpData;
                        params.title = ($PubConst.operationCodes[code] || {}).name
                        res.eventChannel.emit('acceptDataFromOpenerPage', params)
                    }
                })
        }

    },
    tackPicure: function (data) {
        data.info = data.info || {};
        const _this = this;
        wx.hideLoading();
        wx.showLoading({
            title: '上传图片中',
            mask: true
        })

        $Service.upload(_this.data.sendQuene, {test: "test"}, complete => {
            if ((complete.fail || []).length > 0) {
                let quene = [];
                complete.fail.forEach((value) => {
                    quene.push(value.path)
                });
                _this.setData({
                    sendQuene: quene
                });
                wx.showModal({
                    title: '提示',
                    content: '有数据未提交，是否继续？',
                    success(res) {
                        if (res.confirm) {
                            console.log('用户点击确定')
                            data.info.pictureIds = $Service.getSuccessPictureIds(complete.success);
                            _this.toBeContinue(data);
                        }
                    },
                    complete(res) {
                        wx.hideLoading()
                    }
                })
                return
            } else {
                wx.hideLoading();
                data.info.pictureIds = $Service.getSuccessPictureIds(complete.success);
                _this.toBeContinue(data);
            }
        });
    },
    toBeContinue: function (data) {
        wx.hideLoading();
        wx.showLoading({
            title: '流程处理中',
            mask: true
        })
        const _this = this;
        $OperService.toBeContinue(data, operation => {
            operation = operation.data.result
            switch (operation.tacheId) {
                case $TacheService.STATE.END:
                    _this.reloadOrder(data.orderId)
                    break;
                case $TacheService.STATE.WAIT:
                    _this.reloadOrder(data.orderId)
                    break;
                default:
                    _this.reloadOrder(data.orderId);
                    break;
            }

        }, function () {

        }, function () {
            wx.hideLoading();
        })
    },
    reloadOrder: function (orderId) {
        const eventChannel = this.getOpenerEventChannel()
        $OrderService.getOrder({
                orderId: orderId
            }, order => {
                order = $OrderService.modelChange(order.data.result);
                eventChannel.emit('acceptDataFromOpenedPage', {
                    data: {
                        order: order
                    }
                });
                $OperService.getOrderOperation({
                        orderId: order.orderId
                    }, operationNew => {
                        operationNew = operationNew.data.result;
                        this.initalOrder({order: order, operation: operationNew})
                    }, error => console.info(error)
                    , complete => console.info(complete));
            }, error => console.info(error)
            , complete => console.info(complete))
    },
    initalOrder: function (data) {
        const _this = this
        console.info(data)
        _this.setData({
            order: data.order
        })
        let idx = -1;
        const state = _this.data.steps.find((value, index) => {
            const order = data.order;
            const val = (value.id == order.stateId);
            if (val) idx = index;
            return val;
        })
        _this.setData({
            current: idx,
        })
        _this.changeScroll()
        /*const oprVal = {
            id: state.id,
            text: ($PubConst.operationCodes[state.code] || {}).name,
            code: state.code,
            show: false,
        }
        if (data.operation.length > 0) {
            const operation = data.operation[0];
            oprVal.id = operation.tacheId;
            oprVal.text = ($PubConst.operationCodes[operation.tacheVO.code] || {}).name;
            oprVal.code = operation.tacheVO.code;
        }
        oprVal.show = oprVal.text != null;

        _this.setData({
            ['operation.operationTacheId']: oprVal.id,
            ['operation.butText']: oprVal.text,
            ['operation.code']: oprVal.code,
            ['operation.butShow']: oprVal.show,
        })*/
        const operationNew = data.operation
        const operations = []
        if (operationNew.length > 0) {
            operationNew.forEach(operation => {
                operations.push({
                    operationTacheId: operation.tacheId,
                    butText: ($PubConst.operationCodes[operation.tacheVO.code] || {}).name,
                    code: operation.tacheVO.code,
                })
            })
        }
        _this.setData({
            ['operation.oprBut']: operations
        })
    },
    changeScroll: function () {
        const initPos = this.data.scroll.initPos;
        const _this = this
        if (this.data.current >= this.data.scroll.initPos && this.data.current < (this.data.steps.length - 1)) {
            this.setData({
                ['scroll.left']: _this.data.scroll.stepWidth * ((_this.data.current || 1) - 1)
            })
        }
        console.info(this.data.scroll)
    },
    addPicture: function () {
        const _this = this
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths
                const imgUrls = (_this.data.imgUrls || []).concat(tempFilePaths)
                const sendQuene = (_this.data.sendQuene || []).concat(tempFilePaths)
                _this.setData({
                    imgUrls: imgUrls
                })
            }
        })
    },
    preViewPicture: function (e) {
        const imgUrls = $Service.getValueFaster(this.data, e.currentTarget.dataset.key);
        wx.previewImage({
            current: imgUrls[e.currentTarget.dataset.idx], // 当前显示图片的http链接
            urls: imgUrls // 需要预览的图片http链接列表
        })
    },
    openMapBut: function () {
        const _this = this
        wx.openLocation({
            latitude: _this.data.order.latitude,
            longitude: _this.data.order.longitude,
            scale: 18
        })
    },
    scroll: function (e) {
        console.info(e.detail);
        this.data.scroll.stepWidth = parseInt(e.detail.scrollWidth / this.data.steps.length);
        this.data.scroll.scrollViewWidth = e.detail.scrollWidth
    },
    historyBut: function (e) {
        const step = this.data.steps[e.currentTarget.dataset.idx];
        console.info(step);
        const order = (this.data.order);
        const tachePanelInfo = {noData: true};
        tachePanelInfo.id = step.id;
        tachePanelInfo.name = step.name;
        tachePanelInfo.imgs = order["imgs" + step.id] || [];
        if (tachePanelInfo.imgs.length > 0) {
            tachePanelInfo.noData = false;
        }
        this.setData({
            tachePanelInfo: tachePanelInfo
        })
    }
})