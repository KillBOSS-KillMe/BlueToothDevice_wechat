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
    this.getFineList()
  },
  getFineList() {
    this.setData({
      listData: []
    })
    wx.request({
      url: `${app.globalData.requestUrl}/User/user_essence`,
      data: {
        uid: this.data.userInfo.id
      },
      method: "POST",
      success: data => {
        data = app.null2str(data)
        if (data.data.code == '1') {
          data = data.data.data
          let i = 0
          for (i in data) {
            data[i]['createTime'] = app.transformTime(data[i].createTime)
          }
          this.setData({
            listData: data
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
  cancel(e) {
    wx.request({
      url: `${app.globalData.requestUrl}/User/cancel_essence`,
      data: {
        post_id: e.currentTarget.dataset.id
      },
      method: "POST",
      success: data => {
        data = app.null2str(data)
        if (data.data.code == '1') {
          this.getFineList()
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
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})