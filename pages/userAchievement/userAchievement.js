// pages/user-chengjiu/user-chengjiu.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    listData: [],
    requestImgUrl: '',
    originalImgUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      requestImgUrl: app.globalData.requestImgUrl,
      originalImgUrl: app.globalData.originalImgUrl
    })
    this.getAchievementList()
  },
  getAchievementList() {
    wx.request({
      url: `${app.globalData.requestUrl}/User/user_achievement`,
      data: {
        uid: this.data.userInfo.id
      },
      method: "POST",
      success: data => {
        data = app.null2str(data)
        if (data.data.code == '1') {
          this.setData({
            listData: data.data.data.all_achievement
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
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})