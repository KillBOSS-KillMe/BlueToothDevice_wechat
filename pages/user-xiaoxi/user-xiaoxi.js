// pages/user-xiazai/user-xiazai.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // getFlieList() {
    shanchuList: []
  },
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (this.data.shanchuList.length > 0) {
      return ''
    }
    wx.request({
      url: `${app.globalData.requestUrl}/User/del_post`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        uid: '1'
      },
      method: "POST",
      success: res => {
        res = app.null2str(res.data)
        if (res.code == '1') {
          this.setData({
            shanchuList: res.data
          })
        } else {
          wx.showToast({
            title: '暂时没有消息',
            icon: 'none',
            duration: 2000
          })
        }
        console.log(res.data);
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