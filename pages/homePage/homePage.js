// pages/quanxian/quanxian.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gwList:[],
    requestImgUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      requestImgUrl: app.globalData.requestImgUrl
    })
    var that = this;
    wx.request({
      url: `${app.globalData.requestUrl}/Official/official_type`,
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      success: res => {
        res = app.null2str(res.data)
        if (res.code == '1') {
          that.setData({
            gwList: res.data,
          })
        } else {
          wx.showModal({
            title: '',
            content: res.msg,
            showCancel: false
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

  },
  goGamedan(e) {
    wx.navigateTo({
      url: `/pages/gamedan/gamedan?id=${e.currentTarget.dataset.id}`
    })
  }
})