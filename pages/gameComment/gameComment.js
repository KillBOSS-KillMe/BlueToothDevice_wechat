const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    imgUrl: '',
    con: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
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
      wx.showModal({
        title: '',
        content: '评论内容不能为空',
        showCancel: false
      })
      return false
    }
    wx.request({
      url: `${app.globalData.requestUrl}/Official/comment`,
      method: "POST",
      data: {
        game_id: this.data.gameId,
        uid: this.data.userInfo.id,
        content: this.data.con
      },
      success: data => {
        console.log(data)
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
          wx.showModal({
            title: '',
            content: data.data.msg,
            showCancel: false
          })
        }
      }
    })
  }
})