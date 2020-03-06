const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    imgUrl: '',
    gameId: '',
    con: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: `评论-${options.name}`
    })
    this.setData({
      options: options,
      gameId: options.id,
      userInfo: app.globalData.userInfo
    })
    
  },
  getCommentCon(e) {
    this.setData({
      con: e.detail.value
    })
  },
  // 评论提交
  upComment() {
    if (this.data.con == '') {
      wx.showToast({
        title: '评论内容不能为空',
        icon: 'none',
        duration: 2000
      });
      return false
    }
    wx.showToast({
      title: "数据提交中...",
      icon: 'loading',
      duration: 1000000
    });
    wx.request({
      url: `${app.globalData.requestUrl}/Official/comment`,
      method: "POST",
      data: {
        game_id: this.data.options.id,
        uid: this.data.userInfo.id,
        content: this.data.con
      },
      success: data => {
        wx.hideToast()
        data = app.null2str(data)
        if (data.data.code == '1') {
          setTimeout(function() {
            wx.navigateBack({
              delta: 1
            })
          }, 2000)
          wx.showToast({
            title: data.data.msg,
            icon: 'success',
            duration: 2000
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
  }
})