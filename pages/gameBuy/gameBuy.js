/*
 * @Author: luow 
 * @Date: 2019-10-28 14:22:23 
 * @Last Modified by: luow
 * @Last Modified time: 2019-10-28 15:15:11
 */
// pages/gameBuy/gameBuy.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: {},
    userInfo: {},
    imgUrl: '',
    listData: [],
    allPrice: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let listData = JSON.parse(options.list)

    let allPrice = 0
    let idList = ''
    for (let i = 0; i < listData.length; i++) {
      allPrice += parseFloat(listData[i].price)
      idList += listData[i].id
      idList += ','
    }
    idList = idList.substring(0, idList.length - 1)
    this.setData({
      idList: idList,
      allPrice: allPrice,
      listData: listData,
      options: options,
      userInfo: app.globalData.userInfo,
      imgUrl: app.globalData.imgUrl
    })
  },
  runBuy() {
    wx.showToast({
      title: "拼命加载中...",
      icon: 'loading',
      duration: 1000000
    });
    wx.request({
      url: `${app.globalData.requestUrl}/Official/pay`,
      method: 'POST',
      data: {
        uid: this.data.userInfo.id,
        did: this.data.idList,
        openid: this.data.userInfo.openid
      },
      success: data => {
        wx.hideToast()
        data = app.null2str(data)
        if (data.data.code == 1) {
          data = data.data.data
          console.log(data)
          wx.requestPayment({
            'timeStamp': data.timeStamp,
            'nonceStr': data.nonceStr,
            'package': data.package,
            'signType': data.signType,
            'paySign': data.paySign,
            'success': data => {
              console.log(data)
              wx.showToast({
                title: '充值成功',
                icon: 'none',
                duration: 2000
              })
              // 两秒后返回上一页
              setTimeout(e => {
                wx.navigateBack({ changed: true })
              }, 2000)
            },
            'fail': data => {
              console.log(data)
              wx.showToast({
                title: '',
                content: '充值失败',
                showCancel: false
              })
            }
          })
        } else {
          wx.showToast({
            title: '',
            content: data.data.msg
          })
        }
      }
    })
  }
})