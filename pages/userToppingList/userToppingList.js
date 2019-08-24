// pages/user-jiajing/user-jiajing.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    listData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })
    this.getList()
    wx.request({
      url: `${app.globalData.requestUrl}/User/user_top`,
      data: {
        uid: this.data.userInfo.id
      },
      method: "POST",
      success: data => {
        data = app.null2str(data)
        if (data.data.code == '1') {
          this.setData({
            listData: data.data.data
          })
        } else {
          // 无数据时
          wx.showToast({
            title: data.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  getList() {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})