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
    this.getShowUserInfo(options.id)
  },

  getShowUserInfo(id) {
    wx.showToast({
      title: "数据加载中...",
      icon: 'loading',
      duration: 1000000
    });
    wx.request({
      url: `${app.globalData.requestUrl}/User/user_info`,
      method: 'POST',
      data: {
        id: this.data.userInfo.id,
        f_id: id
      },
      success: data => {
        wx.hideToast()
        data = app.null2str(data)
        if (data.data.code == 1) {
          this.setData({
            info: data.data.data
          })
        } else {
          wx.showToast({
            title: data.data.msg,
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },

  // 关注
  attention() {
    // if (this.data.info.is_follow == 1) {
    //   wx.showToast({
    //     title: '已经关注',
    //     icon: 'none',
    //     duration: 2000
    //   });
    //   return false
    // }
    wx.showToast({
      title: "数据提交中...",
      icon: 'loading',
      duration: 1000000
    });
    let url = ''
    if (this.data.info.is_follow == 1) {
      // 执行取消关注
      url = 'User/follow_cancel'
    } else {
      // 执行关注
      url = 'User/follow'
    }
    wx.request({
      url: `${app.globalData.requestUrl}/${url}`,
      method: 'POST',
      data: {
        id: this.data.userInfo.id,
        f_id: this.data.info.id
      },
      success: data => {
        wx.hideToast()
        data = app.null2str(data)
        if (data.data.code == 1) {
          // 刷新用户信息
          this.getShowUserInfo(this.data.info.id)
        } else {
          wx.showToast({
            title: data.data.msg,
            icon: 'none',
            duration: 2000
          });
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