// pages/gameBuy/gameBuy.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: {},
    userInfo: {},
    imgUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      options: options,
      userInfo: app.globalData.userInfo,
      imgUrl: app.globalData.imgUrl
    })
  },
  runBuy() {
    wx.request({
      url: `${app.globalData.requestUrl}/Official/pay`,
      method: 'POST',
      data: {
        uid: this.data.userInfo.id,
        did: this.data.options.id,
        // did: 3,
        openid: this.data.userInfo.openid
      },
      success: data => {
        data = app.null2str(data)
        if (data.data.code == 1) {
          data = data.data.data
          wx.requestPayment({
            'timeStamp': data.timeStamp,
            'nonceStr': data.nonceStr,
            'package': data.package,
            'signType': data.signType,
            'paySign': data.paySign,
            'success': data => {
              // loading图片隐藏
              // this.loadingImgShow = false
              wepy.showModal({
                title: '',
                content: '充值成功',
                showCancel: false
              })
              // 两秒后返回上一页
              setTimeout(e => {
                wx.navigateBack({ changed: true })
              }, 2000)
            },
            'fail': data => {
              console.log(data)
              wepy.showModal({
                title: '',
                content: '充值失败',
                showCancel: false
              })
            }
          })
        } else {
          wx.showModal({
            title: '',
            content: data.data.msg
          })
        }
      }
    })
  }
})