// pages/userInfoShow/userInfoShow.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })
    this.getShowUserInfo(options)
  },

  getShowUserInfo(options) {
    wx.request({
      url: `${app.globalData.requestUrl}/User/user_info`,
      method: 'POST',
      data: {
        id: this.data.userInfo.id,
        f_id: options.id
      },
      success: data => {
        data = app.null2str(data)
        if (data.data.code == 1) {
          this.setData({
            info: data.data.data
          })
          console.log(this.data.info)
        } else {
          wx.showModal({
            title: '',
            content: data.data.msg
          })
        }
      }
    })
  },
  attention() {
    if (this.data.info.is_follow == 1) {
      wx.showModal({
        title: '',
        content: '已经关注'
      })
      return false
    }
    wx.request({
      url: `${app.globalData.requestUrl}/User/follow`,
      method: 'POST',
      data: {
        id: this.data.userInfo.id,
        f_id: this.data.info.id
      },
      success: data => {
        data = app.null2str(data)
        // console.log(data)
        if (data.data.code == 1) {
          let info = this.data.info
          info['is_follow'] = 1
          this.setData({
            info: info
          })
          console.log(this.data.info)
          // console.log(this.data.userInfo)
        } else {
          wx.showModal({
            title: '',
            content: data.data.msg
          })
        }
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

  }
})